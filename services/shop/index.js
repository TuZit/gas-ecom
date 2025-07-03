import bcrypt from "bcrypt";
import crypto from "crypto";

import shopModel from "../../models/shop.model.js";

class shopServices {
  static async signUp({ name, email, password }) {
    try {
      const shopHolder = shopModel.findOne({ email: email }).lean();
      if (shopHolder) {
        return {
          code: "xxx",
          message: "Shop already existed",
          status: "error",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newShop = shopModel.create({
        name,
        email,
        password: hashedPassword,
        role: [ShopRoles.SHOP],
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });
        console.log({ privateKey, publicKey });
      }
    } catch (error) {
      console.log(error);
      return {
        code: "xxx",
        message: "Error",
        status: "error",
      };
    }
  }
}

export default shopServices;

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
