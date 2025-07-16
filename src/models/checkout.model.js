import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DOCUMENT_NAME = "Checkout";
const COLLECTION_NAME = "Checkouts";

const checkoutSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      default: "0",
    },
    cart_userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const checkoutModel = model(DOCUMENT_NAME, checkoutSchema);
export default checkoutModel;
