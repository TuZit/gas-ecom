import { randomInt } from "crypto";
import otpModel from "../models/email/otp.model.js";

function generateRandomToken() {
  return randomInt(0, Math.pow(2, 32));
}

async function newOTP({ email = null }) {
  const token = generateRandomToken();
  const newToken = await otpModel.create({
    otp_token: token,
    otp_email: email,
    otp_status: "pending",
  });
  return newToken;
}

export { newOTP };
