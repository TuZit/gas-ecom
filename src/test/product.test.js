import redisPubSubService from "../services/redisPubsub.service.js";

class ProductTestRedisService {
  async purchaseProduct(productId, quantity) {
    const order = { productId, quantity };
    try {
      console.log(`Publishing purchase order for product ${productId}...`);
      await redisPubSubService.publish("purchase_order", JSON.stringify(order));
      console.log("Publish successful!");
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  }
}

export default new ProductTestRedisService();
