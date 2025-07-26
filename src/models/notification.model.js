import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001: Order successfully
// ORDER-002: Order failed
// PROMOTION-001: New promotion
// SHOP-001: New product by following user

const checkoutSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    noti_receivedId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const notificationModel = model(DOCUMENT_NAME, checkoutSchema);
export default notificationModel;
