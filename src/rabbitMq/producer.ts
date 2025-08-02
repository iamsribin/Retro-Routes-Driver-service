import { Channel } from 'amqplib';

export class Producer {
  constructor(private channel: Channel) {}

  async produceMessages(data: any, correlationId: string, replyToQueue: string) {
    try {
      // Add original timestamp for tracking
      const messageOptions = {
        correlationId: correlationId,
        headers: {
          'x-original-timestamp': Date.now(),
          'x-retry-count': 0
        }
      };

      this.channel.sendToQueue(
        replyToQueue, 
        Buffer.from(JSON.stringify(data)), 
        messageOptions
      );

      console.log(`Message sent with correlationId: ${correlationId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}