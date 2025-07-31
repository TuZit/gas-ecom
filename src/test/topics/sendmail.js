import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

// fan out, direct, topic, header

export const sendMail = async () => {
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

    const myTopic = process.argv.slice(2)?.[1] || "Fixed";
    console.log("shiba", process.argv.slice(2));
    channel.publish(nameExchange, myTopic, Buffer.from("Hellooo"));

    console.log(`Send message to topic: ${myTopic}`);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(error);
  }
};

sendMail();
