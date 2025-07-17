import { convertObjectIdMongodb } from "../../core/utils/object.js";
import inventoryModel from "../inventory.model.js";

export const insertInventory = async ({
  product_id,
  shop_id,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModel.create({
    inventory_productId: product_id,
    inventory_shopId: shop_id,
    inventory_stock: stock,
    inventory_location: location,
  });
};

export const reservationInventory = async ({ productId, cartId, quantity }) => {
  const query = {
    inventory_productId: convertObjectIdMongodb(productId),
    inventory_stock: { $gte: quantity },
  };

  return await inventoryModel.findOneAndUpdate(
    query,
    {
      $inc: { inventory_stock: -quantity },
      $push: {
        inventory_reservations: {
          quantity,
          cartId,
          createAt: new Date(),
        },
      },
    },
    { upsert: true, new: true }
  );
};
