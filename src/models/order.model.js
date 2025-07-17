import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_cartId: {
      type: String,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
      default: [],
    },
    order_trackingNumber: {
      type: String,
      default: "#0001",
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const orderModel = model(DOCUMENT_NAME, orderSchema);
export default orderModel;
