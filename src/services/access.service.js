import bcrypt from "bcrypt";
import crypto from "crypto";

import shopModel from "../models/shop.model.js";
import { createTokenPair } from "../core/utils/authUtil.js";
import { getInfoData } from "../core/utils/object.js";
import KeyTokenService from "./keyToken.service.js";
import { BadRequestError } from "../core/response-handler/error.response.js";

class accessServices {
  static async signUp({ name, email, password }) {
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
  }
}

export default accessServices;

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
