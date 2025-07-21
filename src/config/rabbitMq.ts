import 'dotenv/config'

export const rabbitMq= {
    rabbitMQ: {
      url: String(process.env.RABBITMQ_URL),
    },
    queues: {
        driverQueue: "driver_queue",
      }
  };
