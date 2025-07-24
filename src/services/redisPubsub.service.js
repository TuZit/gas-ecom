import { createClient } from "redis";

class RedisPubSubService {
  constructor() {
    // Trong redis v4, nên tạo một client và duplicate() nó cho subscriber
    this.publisher = createClient();
    this.subscriber = this.publisher.duplicate();

    // Thêm listener 'error' để bắt các lỗi kết nối, rất quan trọng để gỡ lỗi
    this.publisher.on("error", (err) =>
      console.error("Redis Publisher Client Error", err)
    );
    this.subscriber.on("error", (err) =>
      console.error("Redis Subscriber Client Error", err)
    );

    // Kết nối các client. Đây là bước bắt buộc và bất đồng bộ trong redis v4.
    // Các lệnh sẽ được đưa vào hàng đợi cho đến khi kết nối thành công.
    this.publisher
      .connect()
      .then(() => console.log("Redis publisher connected."))
      .catch((err) => console.error("Publisher connection error:", err));
    this.subscriber
      .connect()
      .then(() => console.log("Redis subscriber connected."))
      .catch((err) => console.error("Subscriber connection error:", err));
  }

  async publish(channel, message) {
    // Các phương thức của redis v4 đã trả về Promise, không cần bọc lại.
    // Chờ client kết nối xong trước khi publish
    await this.publisher.isReady;
    return this.publisher.publish(channel, message);
  }

  async subscribe(channel, callback) {
    // Đảm bảo client đã kết nối trước khi đăng ký kênh
    await this.subscriber.isReady;
    // Phương thức subscribe trong v4 nhận listener làm đối số thứ hai.
    await this.subscriber.subscribe(channel, (message) => {
      callback(channel, message);
    });
    console.log(`Successfully subscribed to channel: ${channel}`);
  }
}

// Xuất ra một instance duy nhất để dùng trong toàn bộ ứng dụng
export default new RedisPubSubService();
