import bcrypt from "bcrypt";
import crypto from "crypto";
import nodeCrypto from "node:crypto";

import shopModel from "../models/shop.model.js";
import { createTokenPair, verifyJWTToken } from "../core/utils/authUtil.js";
import { getInfoData } from "../core/utils/object.js";
import KeyTokenService from "./keyToken.service.js";
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
} from "../core/response-handler/error.response.js";
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
    // Tạo key pair
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

    // Gen token
    const tokens = await createTokenPair(
      { id: foundShop._id, email },
      publicKey,
      privateKey
    );
    // Lưu resfreshToken, publicKey vào DB cho 1 sesstion login
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
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

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    // check token is used
    const foundToken = await KeyTokenService.findRefreshTokenUsed(refreshToken);
    if (foundToken) {
      // decode để xác định user
      const { id } = await verifyJWTToken(refreshToken, foundToken.publicKey);
      // xoá tất cả token trong keyStore
      await KeyTokenService.deleteKeyById(id);
      // Token is used
      throw new ForbiddenError("Something went wrong. Please login again!");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop is not register");

    // verify token
    const { id, email } = await verifyJWTToken(
      refreshToken,
      holderToken.publicKey
    );
    // check user
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop is not register");

    // create new keypair
    const tokens = await createTokenPair(
      {
        userId: id,
        email: email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // đã đc sử dụng để lấy token mới rồi
      },
    });

    return {
      user: { id, email },
      tokens,
    };
  };

  static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { id, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(id);
      // Token is used
      throw new ForbiddenError("Something went wrong. Please login again!");
    }

    // check user
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop is not register");

    const tokens = await createTokenPair(
      {
        userId: id,
        email: email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update token
    await keyStore.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken },
    });

    return {
      user,
      tokens,
    };
  };
}

export default AccessServices;

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
