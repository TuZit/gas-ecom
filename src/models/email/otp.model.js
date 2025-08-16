import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "otp_10g";
const COLLECTION_NAME = "otp_logs";
// Declare the Schema of the Mongo model
const otpSchema = new Schema(
  {
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const otpModel = model(DOCUMENT_NAME, otpSchema);
export default otpModel;
