import bcrypt from "bcrypt";
import shopModel from "../models/shop.model.js";

class ShopServices {}

export const findShopByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: [1],
  },
}) => {
  return await shopModel.findOne({ email: email }).select(select).lean();
};

export const createShop = async ({ name, email, password }) => {
  const shopHolder = await shopModel.findOne({ email: email }).lean();
  if (shopHolder) {
    throw new BadRequestError("Error: Shop already existed");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newShop = await shopModel.create({
    name,
    email,
    password: hashedPassword,
    role: [ShopRoles.SHOP],
  });
};

export default ShopServices;

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
