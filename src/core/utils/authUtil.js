import JWT from "jsonwebtoken";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import KeyTokenService from "../../services/keyToken.service.js";
import { HEADER } from "../constants/index.js";
import {
  AuthFailureError,
  NotFoundError,
} from "../response-handler/error.response.js";

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
        console.error("Error when veryfy access token:", err);
      }
      // else {
      //   console.log("decode verify:: ", decode);
      // }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
};

export const authentication = asyncHandler(async (req, res, next) => {
  /* 
  1. Check userID
  2. get access token
  3. verify token
  4. check user
  5. check keyStore with this userID
  6. OK all -> return next()
*/
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("User ID is required");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Nout found keyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Access Token");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.id) throw new AuthFailureError("Invalid User ID");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

export const verifyJWTToken = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
