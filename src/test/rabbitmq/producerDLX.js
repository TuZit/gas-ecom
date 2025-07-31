import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const producerDLX = async ({ msg }) => {
  try {
    const conn = await amqplib.connect(process.env.AMQP_URI);
    // crete channel
    const channel = await conn.createChannel();

    // create new exchange
    await channel.assertExchange(process.env.NOTIFICATION_EXCHANGE, "direct", {
      // định tuyến các message consumer cụ thể (direct), khớp chính xác nhất
      durable: true,
    });

    // create new queue
    const { queue } = await channel.assertQueue(
      process.env.NOTIFICATION_QUEUE,
      {
        exclusive: false, // cho phép các connect kết nối khác truy cập cùng vào queue
        /**
         * nếu 1 message bị lỗi, hết hạn -> đẩy vào 1 hàng đợi DLX queue
         * Với 1 khóa đc chỉ định rõ
         */
        deadLetterExchange: process.env.NOTIFICATION_EXCHANGE_DLX,
        deadLetterRoutingKey: process.env.NOTIFICATION_ROUTING_KEY_DLX,
      }
    );

    // binding queue với exchange
    await channel.bindQueue(
      queue,
      process.env.NOTIFICATION_EXCHANGE
      // process.env.NOTIFICATION_ROUTING_KEY_DLX
    );

    channel.sendToQueue(queue, Buffer.from(msg), {
      expiration: "10000",
    });

    console.log("Send new message to queue", msg);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

const message = process.argv.slice(2).join(" ") || "Hello";
producerDLX({ msg: message });
