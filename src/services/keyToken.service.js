import keytokenModel from "../models/keyToken.model.js";

class KeyTokenService {
  static createKeyToken = async ({ userId, publickey, privateKey }) => {
    try {
      const publickKeyString = publickey.toString();
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey: publickKeyString,
        // privateKey,
      });

      return tokens ? publickKeyString : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

export default KeyTokenService;
