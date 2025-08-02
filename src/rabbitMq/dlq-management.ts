// dlq-management.ts
import { Channel, ConsumeMessage } from "amqplib";
import { rabbitClient } from './client';

export interface DLQMessage {
  correlationId: string;
  operation: string;
  content: any;
  headers: any;
  timestamp: string;
  retryCount: number;
  errorHistory: string[];
  originalTimestamp: number;
}

export class DLQManagementService {
  private channel: Channel | undefined;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Get channel from rabbit client - you might need to expose this method
    // For now, we'll create a separate connection for DLQ management
    try {
      await rabbitClient.initialize();
      // You'll need to expose the channel or create a method to get it
      console.log('DLQ Management Service initialized');
    } catch (error) {
      console.error('Failed to initialize DLQ Management Service:', error);
    }
  }

  // Peek at messages in DLQ without consuming them
  async peekDLQMessages(limit: number = 10): Promise<DLQMessage[]> {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        reject(new Error('Channel not initialized'));
        return;
      }

      const messages: DLQMessage[] = [];
      let messageCount = 0;

      this.channel.consume(
        'driver_queue.dlq', // Your DLQ name
        (message: ConsumeMessage | null) => {
          if (!message) {
            resolve(messages);
            return;
          }

          if (messageCount >= limit) {
            resolve(messages);
            return;
          }

          try {
            const dlqMessage: DLQMessage = {
              correlationId: message.properties.correlationId,
              operation: message.properties.headers?.function,
              content: JSON.parse(message.content.toString()),
              headers: message.properties.headers,
              timestamp: new Date().toISOString(),
              retryCount: message.properties.headers?.['x-retry-count'] || 0,
              errorHistory: message.properties.headers?.['x-error-history'] 
                ? JSON.parse(message.properties.headers['x-error-history']) 
                : [],
              originalTimestamp: message.properties.headers?.['x-original-timestamp'] || 0
            };

            messages.push(dlqMessage);
            messageCount++;

            // Don't acknowledge - we're just peeking
            this.channel!.nack(message, false, true); // Requeue the message

          } catch (error) {
            console.error('Error parsing DLQ message:', error);
            this.channel!.nack(message, false, false); // Don't requeue malformed messages
          }

          if (messageCount >= limit) {
            resolve(messages);
          }
        },
        { noAck: false }
      );

      // Timeout after 5 seconds if no messages
      setTimeout(() => resolve(messages), 5000);
    });
  }

  // Consume and remove messages from DLQ (for analysis/cleanup)
  async consumeDLQMessages(limit: number = 10): Promise<DLQMessage[]> {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        reject(new Error('Channel not initialized'));
        return;
      }

      const messages: DLQMessage[] = [];
      let messageCount = 0;

      this.channel.consume(
        'driver_queue.dlq',
        (message: ConsumeMessage | null) => {
          if (!message) {
            resolve(messages);
            return;
          }

          if (messageCount >= limit) {
            resolve(messages);
            return;
          }

          try {
            const dlqMessage: DLQMessage = {
              correlationId: message.properties.correlationId,
              operation: message.properties.headers?.function,
              content: JSON.parse(message.content.toString()),
              headers: message.properties.headers,
              timestamp: new Date().toISOString(),
              retryCount: message.properties.headers?.['x-retry-count'] || 0,
              errorHistory: message.properties.headers?.['x-error-history'] 
                ? JSON.parse(message.properties.headers['x-error-history']) 
                : [],
              originalTimestamp: message.properties.headers?.['x-original-timestamp'] || 0
            };

            messages.push(dlqMessage);
            this.channel!.ack(message); // Acknowledge and remove from DLQ
            messageCount++;

          } catch (error) {
            console.error('Error parsing DLQ message:', error);
            this.channel!.ack(message); // Remove malformed messages
          }

          if (messageCount >= limit) {
            resolve(messages);
          }
        },
        { noAck: false }
      );

      setTimeout(() => resolve(messages), 5000);
    });
  }

  // Republish messages from DLQ back to main queue (manual recovery)
  async republishFromDLQ(correlationIds: string[]): Promise<{ success: string[], failed: string[] }> {
    const result = { success: [] as string[], failed: [] as string[] };

    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    return new Promise((resolve) => {
      let processedCount = 0;
      const targetCount = correlationIds.length;

      this.channel!.consume(
        'driver_queue.dlq',
        (message: ConsumeMessage | null) => {
          if (!message) {
            if (processedCount === 0) {
              resolve(result);
            }
            return;
          }

          const messageCorrelationId = message.properties.correlationId;

          if (correlationIds.includes(messageCorrelationId)) {
            try {
              // Reset retry count and clear error history for republishing
              const newHeaders = {
                ...message.properties.headers,
                'x-retry-count': 0,
                'x-error-history': JSON.stringify([]),
                'x-republished-from-dlq': true,
                'x-republished-timestamp': Date.now()
              };

              // Republish to main queue
              this.channel!.sendToQueue(
                'driver_queue', // Main queue name
                message.content,
                {
                  ...message.properties,
                  headers: newHeaders
                }
              );

              result.success.push(messageCorrelationId);
              this.channel!.ack(message);

            } catch (error) {
              console.error(`Failed to republish message ${messageCorrelationId}:`, error);
              result.failed.push(messageCorrelationId);
              this.channel!.nack(message, false, true); // Requeue in DLQ
            }

            processedCount++;
          } else {
            // Not a target message, requeue in DLQ
            this.channel!.nack(message, false, true);
          }

          if (processedCount >= targetCount) {
            resolve(result);
          }
        },
        { noAck: false }
      );

      // Timeout after 10 seconds
      setTimeout(() => resolve(result), 10000);
    });
  }

  // Get DLQ statistics
  async getDLQStats(): Promise<{ messageCount: number, oldestMessage?: Date, newestMessage?: Date }> {
    // This would require RabbitMQ Management API or a different approach
    // For now, we'll implement a basic version by peeking at messages
    
    const messages = await this.peekDLQMessages(100); // Sample first 100 messages
    
    if (messages.length === 0) {
      return { messageCount: 0 };
    }

    const timestamps = messages
      .map(m => new Date(m.originalTimestamp))
      .sort((a, b) => a.getTime() - b.getTime());

    return {
      messageCount: messages.length, // This is just a sample, not total count
      oldestMessage: timestamps[0],
      newestMessage: timestamps[timestamps.length - 1]
    };
  }

  // Analyze DLQ messages for patterns
  async analyzeDLQPatterns(): Promise<{
    errorTypes: Record<string, number>,
    operationTypes: Record<string, number>,
    retryDistribution: Record<number, number>,
    timeDistribution: Record<string, number>
  }> {
    const messages = await this.peekDLQMessages(1000); // Analyze up to 1000 messages

    const analysis = {
      errorTypes: {} as Record<string, number>,
      operationTypes: {} as Record<string, number>,
      retryDistribution: {} as Record<number, number>,
      timeDistribution: {} as Record<string, number>
    };

    messages.forEach(message => {
      // Analyze error types
      if (message.errorHistory.length > 0) {
        const lastError = message.errorHistory[message.errorHistory.length - 1];
        const errorType = this.extractErrorType(lastError);
        analysis.errorTypes[errorType] = (analysis.errorTypes[errorType] || 0) + 1;
      }

      // Analyze operation types
      if (message.operation) {
        analysis.operationTypes[message.operation] = (analysis.operationTypes[message.operation] || 0) + 1;
      }

      // Analyze retry distribution
      analysis.retryDistribution[message.retryCount] = (analysis.retryDistribution[message.retryCount] || 0) + 1;

      // Analyze time distribution (by hour of day)
      const hour = new Date(message.originalTimestamp).getHours();
      const hourKey = `${hour}:00`;
      analysis.timeDistribution[hourKey] = (analysis.timeDistribution[hourKey] || 0) + 1;
    });

    return analysis;
  }

  private extractErrorType(errorMessage: string): string {
    // Extract error type from error message
    const patterns = [
      /ValidationError/i,
      /ConnectionError/i,
      /TimeoutError/i,
      /DatabaseError/i,
      /AuthenticationError/i,
      /AuthorizationError/i,
      /NotFoundError/i,
      /ConflictError/i
    ];

    for (const pattern of patterns) {
      if (pattern.test(errorMessage)) {
        return pattern.source.replace(/[\/\\^$*+?.()|[\]{}]/g, '').replace(/i$/, '');
      }
    }

    return 'UnknownError';
  }

  // Purge DLQ (use with caution!)
  async purgeDLQ(): Promise<{ purgedCount: number }> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    try {
      const result = await this.channel.purgeQueue('driver_queue.dlq');
      console.log(`Purged ${result.messageCount} messages from DLQ`);
      return { purgedCount: result.messageCount };
    } catch (error) {
      console.error('Error purging DLQ:', error);
      throw error;
    }
  }
}