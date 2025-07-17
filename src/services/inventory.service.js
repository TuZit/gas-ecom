import { BadRequestError } from "../core/response-handler/error.response";
import inventoryModel from "../models/inventory.model";
import { getProductByID } from "../models/repositories/product.repository";

class InventoryClass {
  static async addStockToInventory({
    productId,
    stock,
    shopId,
    location = "unknow",
  }) {
    const product = await getProductByID(productId);
    if (!product) throw new BadRequestError("Product not found");

    const query = { inventory_productId: productId, inventory_shopId: shopId };
    const update = {
      $inc: {
        inventory_stock: stock,
      },
      $set: {
        inventory_location: location,
      },
    };
    const options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(query, update, options);
  }
}
export default InventoryClass;
