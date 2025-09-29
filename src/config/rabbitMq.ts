import amqp from "amqplib";

const RABBIT_URL = process.env.RABBIT_URL as string;
console.log("RABBIT_URL",RABBIT_URL);

export async function createRabbit() { 
  const conn = await amqp.connect(RABBIT_URL); 
  const ch = await conn.createChannel(); 
  
  await ch.assertExchange("retro.routes", "topic", { durable: true }); 
  
  // Driver-specific queues 
  await ch.assertQueue("driver.rejection", { durable: true }); 
  await ch.assertQueue("driver.timeout", { durable: true }); 
  
  // Bind queues to routing keys 
  await ch.bindQueue("driver.rejection", "retro.routes", "driver.rejection"); 
  await ch.bindQueue("driver.timeout", "retro.routes", "driver.timeout"); 
  
  return { conn, ch }; 
}
