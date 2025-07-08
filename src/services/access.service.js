import bcrypt from "bcrypt";
import crypto from "crypto";
import nodeCrypto from "node:crypto";

import shopModel from "../models/shop.model.js";
import { createTokenPair } from "../core/utils/authUtil.js";
import { getInfoData } from "../core/utils/object.js";
import KeyTokenService from "./keyToken.service.js";
import { BadRequestError } from "../core/response-handler/error.response.js";
import { findShopByEmail } from "./shop.services.js";

class AccessServices {
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
        publicKey: publicKey,
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

  static async login({ email, password, refreshToken }) {
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not found");
    }

    const matchPass = await bcrypt.compare(password, foundShop.password);
    if (!matchPass) {
      throw new BadRequestError("Error: Invalid password");
    }

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

    const tokens = await createTokenPair(
      { id: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publickey: publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      tokens,
      shop: getInfoData({
        fields: ["name", "email", "_id"],
        object: foundShop,
      }),
    };
  }
}

export default AccessServices;

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
