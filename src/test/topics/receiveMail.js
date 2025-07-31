import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

// fan out, direct, topic, header

export const receiveMail = async () => {
  try {
    // create Connect
    const conn = await amqplib.connect(process.env.AMQP_URI);
    // crete channel
    const channel = await conn.createChannel();
    // create name queue
    const nameExchange = "send-mail-exchange";
    await channel.assertExchange(nameExchange, "topic", {
      durable: true,
    });

    const { queue } = await channel.assertQueue("", {
      exclusive: true,
    });

    console.log("Waiting for queue: ", queue);

    // binding
    const args = process.argv.slice(2);
    if (!args.length) {
      process.exit(0);
    }
    args.forEach(async (key) => {
      await channel.bindQueue(queue, nameExchange, key);
    });

    /**
     * Dùng để binding cái key cho topic theo * or #
     * "*" là match với bất kỳ từ nào
     * "#" là match với 1 or nhiều từ bất kỳ
     */

    // consume message
    await channel.consume(
      queue,
      (message) => {
        console.log(
          `Receive message: ${message.content.toString()} from routing key: ${
            message.fields.routingKey
          }`
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const message = process.argv.slice(2).join(" ") || "Hello";
receiveMail({ msg: message });
