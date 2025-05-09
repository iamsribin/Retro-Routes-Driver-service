import { Channel, Connection, connect } from "amqplib";
import rabbitMq from "../config/rabbitMq";
import Consumer from './consumer'
import Producer from './producer'
import RegisterControl from "../controllers/implementation/registerController";
import LoginControl from "../controllers/implementation/loginController";
import AdminController from "../controllers/implementation/admin-controller";
import RegistrationService from "../services/implementation/registration_service";
import LoginService from "../services/implementation/login_service";
import AdminService from "../services/implementation/admin_service";
import DriverRepository from "../repositories/implementation/driver-repo";
import AdminRepository from "../repositories/implementation/admin-repo";
import MessageHandler from "./messageHandler";
import BookingService from "../services/implementation/booking_service";
import BookingController from "../controllers/implementation/booking-controller";
             
 const driverRepository = new DriverRepository();
  const adminRepository = new AdminRepository();
  const loginService = new LoginService(driverRepository)
  const registrationService = new RegistrationService(driverRepository);
  const adminService = new AdminService(adminRepository);
  const loginController = new LoginControl(loginService,registrationService);
  const registerController = new RegisterControl(registrationService);
  const adminController = new AdminController(adminService);
  const bookingService = new BookingService(driverRepository);
  const bookingController = new BookingController(bookingService);
  const messageHandler = new MessageHandler(loginController,registerController,adminController,bookingController);

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
              this.connection.createChannel()
            ]);
      
            this.producerChannel = producerChannel;
            this.consumerChannel = consumerChannel;
      
            const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
              rabbitMq.queues.driverQueue,
              { exclusive: true }
            );
      
            this.producer = new Producer(this.producerChannel);
            this.consumer = new Consumer(this.consumerChannel, rpcQueue,messageHandler);
      
            this.consumer.consumeMessages();
      
            this.isInitialized = true;
          } catch (error) {
            console.log("rabbitmq error...", error);
          }
    }

    async produce(data: any, correlationId: string, replyToQueue: string) {
        if (!this.isInitialized) {
          await this.initialize();
        }
        return await this.producer?.produceMessages(
          data,
          correlationId,
          replyToQueue
        );
      }
  
}

export default RabbitMQClient.getInstance();