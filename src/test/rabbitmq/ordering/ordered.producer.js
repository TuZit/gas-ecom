import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

async function orderedProducer() {
  try {
    const conn = await amqplib.connect("amqp://guest:guest@localhost");
    const channel = await conn.createChannel();

    const nameQueue = "ordered-queue-message";
    await channel.assertQueue(nameQueue, {
      durable: true,
    });

    for (let i = 0; i <= 10; i++) {
      const message = `ordered-queue-message: ${i}`;
      console.log(message);
      channel.sendToQueue(nameQueue, Buffer.from(message), {
        persistent: true,
      });
    }

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

orderedProducer();
