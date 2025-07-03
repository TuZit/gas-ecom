import bcrypt from "bcrypt";
import crypto from "crypto";

import shopModel from "../models/shop.model.js";
import { createTokenPair } from "../utils/authUtil.js";
import { getInfoData } from "../utils/object.js";
import KeyTokenService from "./keyToken.service.js";

class accessServices {
  static async signUp({ name, email, password }) {
    try {
      const shopHolder = await shopModel.findOne({ email: email }).lean();
      if (shopHolder) {
        return {
          code: 409,
          message: "Shop already existed",
          status: "error",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        role: [ShopRoles.SHOP],
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publickey: publicKey,
        });

        const token = await createTokenPair(
          { id: newShop._id, email },
          // crypto.createPublicKey(publicKeyString),
          publicKeyString,
          privateKey
        );

        return {
          code: 201,
          data: {
            ...getInfoData({
              fields: ["name", "email", "_id"],
              object: newShop,
            }),
            ...token,
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        message: "Error",
        status: "error",
      };
    }
  }
}

export default accessServices;

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
