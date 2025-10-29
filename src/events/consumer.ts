import { createChannel, QUEUES } from "@retro-routes/shared";
import { Channel } from "amqplib";
import { IDriverController } from "../controllers/interfaces/i-driver-controller";

export class DriverConsumer {

   private ch?: Channel;
   
  constructor(private driverController: IDriverController) {}

  async start() {
    const RABBIT_URL = process.env.RABBIT_URL!;
    const ch = await createChannel(RABBIT_URL);
    this.ch = ch;

    console.log("🚀 Driver service started with RabbitMQ consumers");

    // Driver rejection handler
    await ch.consume(QUEUES.driver.rejection, async (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        console.log("📩 driver.rejection payload:", payload);

        await this.driverController.increaseCancelCount(payload);
        ch.ack(msg);
      } catch (err) {
        console.error("❌ driver.rejection handler error:", err);
        ch.nack(msg, false, false);
      }
    });
  }

  async stop() {
    try {
      if (this.ch) await this.ch.close();
      console.log("✅ Driver consumer channel closed");
    } catch (err) {
      console.error("❌ Error stopping driver consumer:", err);
    }
  }
}

