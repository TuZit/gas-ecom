import redisPubSubService from "../services/redisPubsub.service.js";

class InventoryTestService {
  // Constructor giờ sẽ trống, việc khởi tạo được xử lý trong init()
  constructor() {}

  // Phương thức khởi tạo bất đồng bộ
  async init() {
    await redisPubSubService.subscribe("purchase_order", (channel, message) => {
      console.log("Received message on channel: ", channel);
      const { productId, quantity } = JSON.parse(message);
      this.updateInventory(productId, quantity);
    });
    return this; // Trả về instance để có thể dùng sau này
  }

  // Chuyển thành phương thức của instance
  updateInventory(productId, quantity) {
    console.log(
      `update inventory for product: ${productId} with ${quantity} pcs`
    );
  }
}

// Export ra một promise, promise này sẽ resolve với instance của service sau khi đã khởi tạo xong
export default new InventoryTestService().init();
