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
      /**
       * true: giữ lại data khi downtime,khi start lại queue không bị mất message
       * durable là thuộc tính của queue=> durable: true queue sẽ ko mất khi restart
       */
      durable: true,
    });

    // send to queue: dùng Buffer dưới dạng byte -> nhanh
    channel.sendToQueue(nameQueue, Buffer.from(msg), {
      // TTL: time to life
      // sau 10s tự động xoá khỏi queue
      expiration: 10000,

      // persistent là thuộc tính của message => persistent: true tin nhắn này sẽ ko mất khi khởi động lại
      // tuy nhiên chỉ có tác dụng khi message này nằm trong 1 queue có durable = true
      persistent: true,
    });

    // close connection, channel
  } catch (error) {
    console.error(error);
  }
};

const message = process.argv.slice(2).join(" ") || "Hello";
sendQueue({ msg: message });
