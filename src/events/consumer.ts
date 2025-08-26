import { createRabbit } from "../config/rabbitMq";
import { DriverController } from "../controllers/implementation/driver-controller";

export class DriverConsumer {
  private ch: any;

  constructor(private driverEventHandler: DriverController) {}

  async start() {
    const { conn, ch } = await createRabbit();
    this.ch = ch;

    console.log("🚀 Driver service started with RabbitMQ consumers");

    // Rejection (cancel count increase)
    await ch.consume("driver.rejection", async (msg: any) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        console.log("📩 driver.rejection payload:", payload);

        await this.driverEventHandler.increaseCancelCount(payload);

        ch.ack(msg);
      } catch (err) {
        console.error("❌ DriverRejection handler error:", err);
        ch.nack(msg, false, false); // dead-letter
      }
    });

  }

  async stop() {
    try {
      if (this.ch) {
        await this.ch.close();
        console.log("✅ RabbitMQ channel closed in driver service");
      }
    } catch (error) {
      console.error("❌ Error stopping driver consumer:", error);
    }
  }
}
