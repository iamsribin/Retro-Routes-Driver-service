import { Channel, Connection, connect } from "amqplib";
import {rabbitMq} from "../config/rabbitMq";
import {Consumer} from "./consumer";
import {Producer} from "./producer";
import {RegisterController} from "../controllers/implementation/register-controller";
import {LoginController} from "../controllers/implementation/login-controller";
import {AdminController} from "../controllers/implementation/admin-controller";
import {RegistrationService} from "../services/implementation/registration-service";
import {LoginService} from "../services/implementation/login-service";
import {AdminService} from "../services/implementation/admin-service";
import {DriverRepository} from "../repositories/implementation/driver-repository";
import {AdminRepository} from "../repositories/implementation/admin-repository";
import {MessageHandler} from "./message-handler";
import {BookingService} from "../services/implementation/booking_service";
import {BookingController} from "../controllers/implementation/booking-controller";
import {DriverController} from "../controllers/implementation/driver-controller";
import {DriverService} from "../services/implementation/driver_service";
import { BaseRepository } from "../repositories/implementation/base-repository";
import { DriverModel } from "../model/driver.model";
import { ResubmissionModel } from "../model/resubmission.model";

const driverRepository = new DriverRepository();
const adminRepository = new AdminRepository();
const driverBaseRepository = new BaseRepository(DriverModel);
const resubmissionBaseRepository = new BaseRepository(ResubmissionModel);

const loginService = new LoginService(driverBaseRepository,resubmissionBaseRepository,driverRepository);
const registrationService = new RegistrationService(driverRepository,driverBaseRepository);
const adminService = new AdminService(adminRepository,driverBaseRepository,resubmissionBaseRepository);
const driverService = new DriverService(driverRepository,driverBaseRepository);
const bookingService = new BookingService(driverRepository);

const loginController = new LoginController(loginService);
const registerController = new RegisterController(registrationService);
const adminController = new AdminController(adminService);
const bookingController = new BookingController(bookingService);
const driverController = new DriverController(driverService);

const messageHandler = new MessageHandler(
  driverController,
  loginController,
  registerController,
  adminController,
  bookingController
);

class RabbitMQClient {
  private static instance: RabbitMQClient;
  private isInitialized = false;

  private producer: Producer | undefined;
  private consumer: Consumer | undefined;
  private connection: Connection | undefined;
  private producerChannel: Channel | undefined;
  private consumerChannel: Channel | undefined;

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

      const [producerChannel, consumerChannel] = await Promise.all([
        this.connection.createChannel(),
        this.connection.createChannel(),
      ]);

      this.producerChannel = producerChannel;
      this.consumerChannel = consumerChannel;

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
        rabbitMq.queues.driverQueue,
        // { exclusive: true } 
      );

      this.producer = new Producer(this.producerChannel);
      this.consumer = new Consumer(
        this.consumerChannel,
        rpcQueue,
        messageHandler
      );

      this.consumer.consumeMessages();

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }

  async produce(data: any, correlationId: string, replyToQueue: string) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return await this.producer?.produceMessages(
        data,
        correlationId,
        replyToQueue
      );
    } catch (error) {
      console.log("produce error==", error);
    }
  }
}

export const rabbitClient = RabbitMQClient.getInstance();
