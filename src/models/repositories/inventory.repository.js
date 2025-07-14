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
