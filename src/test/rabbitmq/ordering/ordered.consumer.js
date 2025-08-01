import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

async function orderedComsumerMessage() {
  try {
    const conn = await amqplib.connect("amqp://guest:guest@localhost");
    const channel = await conn.createChannel();

    const nameQueue = "ordered-queue-message";
    await channel.assertQueue(nameQueue, {
      durable: true,
    });

    // mỗi tác vụ chỉ thực hiện 1 lần, ko cho lần thứ 2
    // thg này phải xong thì mới thg khác mới đc xử lý
    // consumer xử lý tuần tự. 1 người chỉ làm 1 việc mà thôi, ko thể làm 2 việc 1 lúc
    channel.prefetch(1);

    channel.consume(nameQueue, (msg) => {
      setTimeout(() => {
        console.log("Receive message:", msg.content.toString());
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(error);
  }
}

orderedComsumerMessage();

/**
 * Nói một cách đơn giản, channel.prefetch(1) có nghĩa là: "Hỡi RabbitMQ, chỉ gửi cho tôi (consumer này) tối đa 1 tin nhắn tại một thời điểm.
 * Đừng gửi tin nhắn tiếp theo cho đến khi tôi xử lý xong và gửi lại xác nhận (acknowledgement) cho tin nhắn hiện tại."
 *
 * CƠ CHẾ HOẠT ĐỘNG
 *  - Khi một consumer kết nối đến queue, RabbitMQ sẽ bắt đầu đẩy tin nhắn đến nó.
 *  - Nếu bạn đã gọi channel.prefetch(1), RabbitMQ sẽ gửi 1 tin nhắn đầu tiên.
 *  - RabbitMQ sẽ tạm dừng việc gửi thêm tin nhắn cho consumer đó cho đến khi consumer gọi channel.ack(msg) để báo rằng nó đã xử lý xong tin nhắn vừa nhận.
 *  - Ngay khi nhận được ack, RabbitMQ hiểu rằng consumer đã sẵn sàng và sẽ gửi tin nhắn tiếp theo trong hàng đợi (nếu có).
 *
 * USE CASE
 *  1.Fair Dispatch (Phân phối công bằng)
 *      - Nếu có nhiều consumer (workers) cùng lắng nghe trên một queue
 *      - Không có prefetch: RabbitMQ sẽ gửi tin nhắn một cách "mù quáng" cho các consumer theo kiểu round-robin.
 *      - Nếu worker 1 nhận 5 tin nhắn và worker 2 nhận 5 tin nhắn, nhưng worker 1 xử lý rất nhanh (1 giây/tin) còn worker 2 xử lý rất chậm (10 giây/tin),
 *      - -> thì worker 1 sẽ rảnh rỗi trong khi worker 2 vẫn đang "vật lộn" với đống tin nhắn của mình.
 *  2. Ordered Processing (Xử lý tuần tự):
 *      - ngăn chặn việc consumer nhận đồng thời nhiều tin nhắn và xử lý chúng song song
 *      - (có thể dẫn đến sai thứ tự do thời gian xử lý khác nhau).
 */
