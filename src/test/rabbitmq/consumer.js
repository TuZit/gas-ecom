import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export const receiveQueue = async () => {
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

    // receive queue
    channel.consume(
      nameQueue,
      (msg) => {
        console.log("Receive message:", msg.content.toString());
      },
      {
        /**
         * Cơ chế xác nhận 1 message
         * Producer thông báo cho consumer về 1 message
         * Nếu Consumer đã xử lý message đó rồi -> gửi lại 1 tin nhắn xác nhận ack=true
         * Để -> rabbitMQ hiểu đa xử lý thành công message đó rồi
         * -> xóa message khỏi queue, lần sau không gửi lại
         */
        noAck: true,
        // true: cơ chế như trên
        // false: vẫn cho các consumer khác nhận message, vì nó hiểu là chưa xử lý done
      }
    );

    // close connection, channel
  } catch (error) {
    console.error(error);
  }
};

receiveQueue();
