import JWT from "jsonwebtoken";

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(err);
      } else {
        console.log("decode verify: ", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};
