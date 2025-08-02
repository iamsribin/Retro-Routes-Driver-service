// Enhanced consumer.ts
import { Channel, ConsumeMessage } from "amqplib";
import { MessageHandler } from './message-handler';
import { CircuitBreaker } from './circuit-breaker';

interface QueueConfig {
  main: string;
  retry: string;
  dlq: string;
}

interface MessageMetadata {
  retryCount: number;
  originalTimestamp: number;
  lastRetryTimestamp?: number;
  errorHistory: string[];
}

export class Consumer {
  private messageHandler: MessageHandler;
  private maxRetries = 3;
  private retryExchange: string;

  constructor(
    private channel: Channel,
    private queueConfig: QueueConfig,
    messageHandler: MessageHandler,
    private circuitBreaker: CircuitBreaker
  ) {
    this.messageHandler = messageHandler;
    this.retryExchange = `${this.queueConfig.main}.retry.exchange`;
  }

  async consumeMessages() {
    // Consume from main queue
    this.channel.consume(
      this.queueConfig.main, 
      async (message: ConsumeMessage | null) => {
        await this.handleMessage(message, 'main');
      },
      { 
        noAck: false // Important: Use manual acknowledgment for retry mechanism
      }
    );

    console.log(`Consumer started for queue: ${this.queueConfig.main}`);
  }

  private async handleMessage(message: ConsumeMessage | null, queueType: 'main' | 'retry' = 'main') {
    if (!message) {
      console.log("Received null message");
      return;
    }

    // Check circuit breaker state
    if (this.circuitBreaker.getState() === 'OPEN') {
      console.log("Circuit breaker is OPEN, rejecting message");
      this.channel.nack(message, false, false); // Send to DLQ
      return;
    }

    try {
      const messageMetadata = this.extractMessageMetadata(message);
      
      if (!message.properties) {
        throw new Error("Message properties are missing");
      }

      const { correlationId, replyTo } = message.properties;
      const operation = message.properties.headers?.function;

      if (!correlationId || !replyTo) {
        throw new Error("Missing correlationId or replyTo");
      }

      if (!message.content) {
        throw new Error("Message content is null or undefined");
      }

      // Parse message content
      const messageContent = JSON.parse(message.content.toString());

      // Process message through circuit breaker
      await this.circuitBreaker.execute(async () => {
        await this.messageHandler.handle(
          operation,
          messageContent,
          correlationId,
          replyTo
        );
      });

      // Acknowledge successful processing
      this.channel.ack(message);
      
      console.log(`Message processed successfully: ${correlationId}`);

    } catch (error) {
      console.error(`Error processing message:`, error);
      await this.handleMessageError(message, error as Error);
    }
  }

  private extractMessageMetadata(message: ConsumeMessage): MessageMetadata {
    const headers = message.properties.headers || {};
    
    return {
      retryCount: headers['x-retry-count'] || 0,
      originalTimestamp: headers['x-original-timestamp'] || Date.now(),
      lastRetryTimestamp: headers['x-last-retry-timestamp'],
      errorHistory: headers['x-error-history'] ? JSON.parse(headers['x-error-history']) : []
    };
  }

  private async handleMessageError(message: ConsumeMessage, error: Error) {
    const metadata = this.extractMessageMetadata(message);
    
    // Update error history
    metadata.errorHistory.push(`${new Date().toISOString()}: ${error.message}`);
    metadata.retryCount += 1;
    metadata.lastRetryTimestamp = Date.now();

    // Check if we should retry or send to DLQ
    if (metadata.retryCount <= this.maxRetries && this.isRetryableError(error)) {
      await this.sendToRetryQueue(message, metadata);
      this.channel.ack(message); // Acknowledge original message
      console.log(`Message sent to retry queue. Attempt ${metadata.retryCount}/${this.maxRetries}`);
    } else {
      // Send to DLQ or reject (which will trigger DLQ due to queue configuration)
      this.channel.nack(message, false, false);
      console.log(`Message sent to DLQ after ${metadata.retryCount} attempts`);
      
      // Log final failure
      this.logFailedMessage(message, metadata, error);
    }
  }

  private async sendToRetryQueue(message: ConsumeMessage, metadata: MessageMetadata) {
    try {
      const retryHeaders = {
        ...message.properties.headers,
        'x-retry-count': metadata.retryCount,
        'x-original-timestamp': metadata.originalTimestamp,
        'x-last-retry-timestamp': metadata.lastRetryTimestamp,
        'x-error-history': JSON.stringify(metadata.errorHistory)
      };

      // Calculate exponential backoff delay
      const delay = this.calculateRetryDelay(metadata.retryCount);

      await this.channel.publish(
        this.retryExchange,
        'retry',
        message.content,
        {
          ...message.properties,
          headers: retryHeaders,
          expiration: delay
        }
      );

      console.log(`Message scheduled for retry in ${delay}ms`);
    } catch (error) {
      console.error('Error sending message to retry queue:', error);
      // If we can't send to retry queue, reject the message
      this.channel.nack(message, false, false);
    }
  }

  private calculateRetryDelay(retryCount: number): number {
    // Exponential backoff: 2^retryCount * 1000ms (with jitter)
    const baseDelay = Math.pow(2, retryCount) * 1000;
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    return Math.min(baseDelay + jitter, 300000); // Cap at 5 minutes
  }

  private isRetryableError(error: Error): boolean {
    // Define which errors are retryable
    const nonRetryableErrors = [
      'ValidationError',
      'AuthenticationError',
      'AuthorizationError',
      'BadRequestError'
    ];

    const errorName = error.constructor.name;
    const isRetryable = !nonRetryableErrors.includes(errorName) && 
                       !error.message.toLowerCase().includes('validation') &&
                       !error.message.toLowerCase().includes('unauthorized');

    console.log(`Error ${errorName} is ${isRetryable ? 'retryable' : 'non-retryable'}`);
    return isRetryable;
  }

  private logFailedMessage(message: ConsumeMessage, metadata: MessageMetadata, finalError: Error) {
    const logData = {
      correlationId: message.properties.correlationId,
      operation: message.properties.headers?.function,
      retryCount: metadata.retryCount,
      originalTimestamp: new Date(metadata.originalTimestamp).toISOString(),
      finalError: finalError.message,
      errorHistory: metadata.errorHistory,
      messageContent: message.content.toString()
    };

    // Log to your preferred logging system
    console.error('Message failed permanently:', JSON.stringify(logData, null, 2));
    
    // You can also send this to a monitoring system like DataDog, New Relic, etc.
    // this.monitoringService.logFailedMessage(logData);
  }

  // Method to manually process DLQ messages (for admin/debugging)
  async processDLQMessages(limit: number = 10) {
    return new Promise((resolve) => {
      const processedMessages: any[] = [];
      let messageCount = 0;

      this.channel.consume(
        this.queueConfig.dlq,
        (message: ConsumeMessage | null) => {
          if (!message || messageCount >= limit) {
            resolve(processedMessages);
            return;
          }

          const messageData = {
            correlationId: message.properties.correlationId,
            content: JSON.parse(message.content.toString()),
            headers: message.properties.headers,
            timestamp: new Date().toISOString()
          };

          processedMessages.push(messageData);
          this.channel.ack(message);
          messageCount++;

          if (messageCount >= limit) {
            resolve(processedMessages);
          }
        },
        { noAck: false }
      );
    });
  }
}