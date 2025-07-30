import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export const sendQueue = async ({ msg }) => {
  try {
    // create Connect
    const conn = await amqplib.connect(process.env.AMQP_URI);
    // crete channel
    const channel = await conn.createChannel();
    // create name queue
    const nameQueue = "test-queue";
    await channel.assertQueue(nameQueue, {
      durable: true, // giữ lại data khi downtime
    });

    // send to queue: dùng Buffer dưới dạng byte -> nhanh
    channel.sendToQueue(nameQueue, Buffer.from(msg), {
      expiration: 10000, // TTL: time to life
    });

    // close connection, channel
  } catch (error) {
    console.error(error);
  }
};

const message = process.argv.slice(2).join(" ") || "Hello";
sendQueue({ msg: message });
