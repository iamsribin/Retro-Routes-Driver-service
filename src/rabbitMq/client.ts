import { Channel, Connection, connect } from "amqplib";
import rabbitMq from "../config/rabbitMq";
import Consumer from './consumer'
import Producer from './producer'
import RegisterControl from "../controllers/registerController";
import LoginControl from "../controllers/loginController";
import AdminController from "../controllers/admin-controller";
import RegistrationUseCases from "../useCases/registration.use-cases";
import LoginUseCases from "../useCases/login.use-cases";
import AdminUsecases from "../useCases/admin.use-cases";
import DriverReposiory from "../repositories/driver-repo";
import AdminReposiory from "../repositories/admin-repo";
import MessageHandler from "./messageHandler";
import BookingUseCase from "../useCases/booking.use-cases";
import BookingController from "../controllers/booking-controller";

  const driverReposiory = new DriverReposiory();
  const adminReposiory = new AdminReposiory();
  const loginUseCase = new LoginUseCases(driverReposiory)
  const registrationUseCase = new RegistrationUseCases(driverReposiory);
  const adminUsecases = new AdminUsecases(adminReposiory);
  const loginController = new LoginControl(loginUseCase,registrationUseCase);
  const registerController = new RegisterControl(registrationUseCase);
  const adminController = new AdminController(adminUsecases);
  const bookingUsecase = new BookingUseCase(driverReposiory);
  const bookingController = new BookingController(bookingUsecase);

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