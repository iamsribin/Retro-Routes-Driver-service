import { createChannel, QUEUES } from '@retro-routes/shared';
import { Channel } from 'amqplib';
import { container } from '../config/inversify.config';
import { IDriverController } from '../controllers/interfaces/i-driver-controller';
import { TYPES } from '../types/inversify-types';

const driverController = container.get<IDriverController>(
    TYPES.DriverController
);

class DriverConsumer {
    private ch?: Channel;

    constructor(private driverController: IDriverController) {}

    async start() {
        try {
            const RABBIT_URL = process.env.RABBIT_URL!;
            const ch = await createChannel(RABBIT_URL);
            this.ch = ch;

            console.log('🚀 Driver service started with RabbitMQ consumers');

            // Driver rejection handler
            await ch.consume(QUEUES.driver.rejection, async (msg) => {
                if (!msg) return;
                try {
                    const payload = JSON.parse(msg.content.toString());
                    console.log('📩 driver.rejection payload:', payload);

                    await this.driverController.increaseCancelCount(payload);
                    ch.ack(msg);
                } catch (err) {
                    console.error('❌ driver.rejection handler error:', err);
                    ch.nack(msg, false, false);
                }
            });
        } catch (err) {
            console.log(err);

            process.exit(1);
        }
    }

    async stop() {
        try {
            if (this.ch) await this.ch.close();
            console.log('✅ Driver consumer channel closed');
        } catch (err) {
            console.error('❌ Error stopping driver consumer:', err);
        }
    }
}

export const consumer = new DriverConsumer(driverController);
