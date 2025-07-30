import amqplib from "amqplib";

const postVideo = async ({ msg }) => {
  try {
    // create connection
    const connection = await amqplib.connect(process.env.AMQP_URI);
    // crete channel
    const channel = await connection.createChannel();
    // create exchange
    const exchangeName = "test-exchange";
    await channel.assertExchange(exchangeName, "fanout", {
      durable: false,
    });
    // publish video
    channel.publish(exchangeName, "", Buffer.from(msg));
    console.log("Send video to exchange: ", exchangeName);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(error);
  }
};

const mess = process.argv.slice(2).join(" ") || "Hello Exchange";
postVideo({ msg: mess });
