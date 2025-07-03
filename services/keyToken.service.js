const keytokenModel = require(" . /models/keytoken model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publickey, privateKey }) => {
    try {
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens ? tokens - publickey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

export default KeyTokenService;
