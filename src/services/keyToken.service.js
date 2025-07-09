import { Types } from "mongoose";
import keytokenModel from "../models/keyToken.model.js";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const publickKeyString = publickey.toString();
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publickKeyString,
      //   privateKey,
      // });

      const filters = {
        user: userId,
      };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filters,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    // return await keytokenModel.findByIdAndDelete(id).lean();
    return await keytokenModel
      .deleteOne({ _id: new Types.ObjectId(id) })
      .lean();
  };
}

export default KeyTokenService;
