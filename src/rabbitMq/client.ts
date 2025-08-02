import { Channel, Connection, connect } from "amqplib";
import { rabbitMq } from "../config/rabbitMq";
import { Consumer } from "./consumer";
import { Producer } from "./producer";
import { RegisterController } from "../controllers/implementation/register-controller";
import { LoginController } from "../controllers/implementation/login-controller";
import { AdminController } from "../controllers/implementation/admin-controller";
import { RegistrationService } from "../services/implementation/registration-service";
import { LoginService } from "../services/implementation/login-service";
import { AdminService } from "../services/implementation/admin-service";
import { DriverRepository } from "../repositories/implementation/driver-repository";
import { AdminRepository } from "../repositories/implementation/admin-repository";
import { MessageHandler } from "./message-handler";
import { RideService } from "../services/implementation/ride-service";
import { RideController } from "../controllers/implementation/ride-controller";
import { DriverController } from "../controllers/implementation/driver-controller";
import { DriverService } from "../services/implementation/driver-service";
import { BaseRepository } from "../repositories/implementation/base-repository";
import { DriverModel } from "../model/driver.model";
import { ResubmissionModel } from "../model/resubmission.model";
import { RideRepository } from "../repositories/implementation/ride-repository";
import { CircuitBreaker } from "./circuit-breaker";

const driverRepository = new DriverRepository();
const adminRepository = new AdminRepository();
const driverBaseRepository = new BaseRepository(DriverModel);
const resubmissionBaseRepository = new BaseRepository(ResubmissionModel);
const rideRepository = new RideRepository();

const loginService = new LoginService(driverBaseRepository, resubmissionBaseRepository, driverRepository);
const registrationService = new RegistrationService(driverRepository, driverBaseRepository);
const adminService = new AdminService(adminRepository, driverBaseRepository, resubmissionBaseRepository);
const driverService = new DriverService(driverRepository, driverBaseRepository);
const bookingService = new RideService(driverRepository, rideRepository);

const loginController = new LoginController(loginService);
const registerController = new RegisterController(registrationService);
const adminController = new AdminController(adminService);
const bookingController = new RideController(bookingService);
const driverController = new DriverController(driverService);

const messageHandler = new MessageHandler(
  driverController,
  loginController,
  registerController,
  adminController,
  bookingController
);

interface QueueConfig {
  main: string;
  retry: string;
  dlq: string;
}

class RabbitMQClient {
  private static instance: RabbitMQClient;
  private isInitialized = false;

  private producer: Producer | undefined;
  private consumer: Consumer | undefined;
  private connection: Connection | undefined;
  private producerChannel: Channel | undefined;
  private consumerChannel: Channel | undefined;
  
  // Circuit breaker for message processing
  private circuitBreaker: CircuitBreaker;

  // Queue configurations
  private queueConfig: QueueConfig = {
    main: rabbitMq.queues.driverQueue,
    retry: `${rabbitMq.queues.driverQueue}.retry`,
    dlq: `${rabbitMq.queues.driverQueue}.dlq`
  };

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      monitoringPeriod: 60000 // 1 minute
    });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      this.connection = await connect(rabbitMq.rabbitMQ.url);

      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.circuitBreaker.recordFailure();
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.isInitialized = false;
      });

      const [producerChannel, consumerChannel] = await Promise.all([
        this.connection.createChannel(),
        this.connection.createChannel(),
      ]);

      this.producerChannel = producerChannel;
      this.consumerChannel = consumerChannel;

      // Setup error handling for channels
      this.producerChannel.on('error', (err) => {
        console.error('Producer channel error:', err);
        this.circuitBreaker.recordFailure();
      });

      this.consumerChannel.on('error', (err) => {
        console.error('Consumer channel error:', err);
        this.circuitBreaker.recordFailure();
      });

      // Setup queues with DLQ and retry mechanism
      await this.setupQueues();

      this.producer = new Producer(this.producerChannel);
      this.consumer = new Consumer(
        this.consumerChannel,
        this.queueConfig,
        messageHandler,
        this.circuitBreaker
      );

      this.consumer.consumeMessages();
      this.isInitialized = true;
      
      console.log('RabbitMQ client initialized with DLQ and retry mechanism');
    } catch (error) {
      console.error("RabbitMQ initialization error:", error);
      this.circuitBreaker.recordFailure();
      throw error;
    }
  }

  private async setupQueues() {
    if (!this.consumerChannel) throw new Error('Consumer channel not initialized');

    // Setup Dead Letter Exchange
    const dlxExchange = `${this.queueConfig.main}.dlx`;
    await this.consumerChannel.assertExchange(dlxExchange, 'direct', { durable: true });

    // Setup Retry Exchange with TTL
    const retryExchange = `${this.queueConfig.main}.retry.exchange`;
    await this.consumerChannel.assertExchange(retryExchange, 'direct', { durable: true });

    // Main queue with DLX configuration
    await this.consumerChannel.assertQueue(this.queueConfig.main, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlxExchange,
        'x-dead-letter-routing-key': 'dlq'
      }
    });

    // Retry queue with TTL and DLX back to main queue
    await this.consumerChannel.assertQueue(this.queueConfig.retry, {
      durable: true,
      arguments: {
        'x-message-ttl': 30000, // 30 seconds delay
        'x-dead-letter-exchange': '', // Default exchange
        'x-dead-letter-routing-key': this.queueConfig.main
      }
    });

    // Dead Letter Queue
    await this.consumerChannel.assertQueue(this.queueConfig.dlq, {
      durable: true
    });

    // Bind queues to exchanges
    await this.consumerChannel.bindQueue(this.queueConfig.retry, retryExchange, 'retry');
    await this.consumerChannel.bindQueue(this.queueConfig.dlq, dlxExchange, 'dlq');

    console.log('Queues setup completed with DLQ and retry mechanism');
  }

  async produce(data: any, correlationId: string, replyToQueue: string) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Check circuit breaker before processing
      if (this.circuitBreaker.getState() === 'OPEN') {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }

      const result = await this.producer?.produceMessages(
        data,
        correlationId,
        replyToQueue
      );

      this.circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      console.error("Produce error:", error);
      this.circuitBreaker.recordFailure();
      throw error;
    }
  }

  // Method to get circuit breaker stats
  getCircuitBreakerStats() {
    return {
      state: this.circuitBreaker.getState(),
      failureCount: this.circuitBreaker.getFailureCount(),
      lastFailureTime: this.circuitBreaker.getLastFailureTime()
    };
  }

  // Graceful shutdown
  async close() {
    try {
      if (this.producerChannel) await this.producerChannel.close();
      if (this.consumerChannel) await this.consumerChannel.close();
      if (this.connection) await this.connection.close();
      this.isInitialized = false;
      console.log('RabbitMQ client closed gracefully');
    } catch (error) {
      console.error('Error closing RabbitMQ client:', error);
    }
  }
}

export const rabbitClient = RabbitMQClient.getInstance();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing RabbitMQ client...');
  await rabbitClient.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing RabbitMQ client...');
  await rabbitClient.close();
  process.exit(0);
});