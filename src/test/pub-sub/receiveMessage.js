import amqplib from "amqplib";

/**
 * Tất cả những subcriber sẽ đc nhận chung message từ Producer
 * Khi chạy nhiều receiveMessage, chúng đều hứng đc message từ postVideo
 */

const receiveMessage = async () => {
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
    // create queue
    const { queue } = await channel.assertQueue("", {
      // nếu shutdown cái subcriber này -> tự động xoá queue này trên rabbitMQ
      exclusive: true,
    });

    /**
     * Quá trình binding
     * Producer -> Exchange -> qua quá trình binding -> Queue
     * Mối quan hệ giữa exchange và queue là binding
     * Nằm ở giữa
     */
    channel.bindQueue(queue, exchangeName, "");

    channel.consume(
      queue,
      (message) => {
        console.log(
          `Receive message: ${message.content.toString()} - from exchange: ${exchangeName}`
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

receiveMessage();
