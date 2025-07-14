import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      /** số lượng discount đc áp dụng */ type: Number,
      required: true,
    },
    discount_uses_count: {
      /** số lượng discount đã sử dụng  */ type: Number,
      required: true,
    },
    discount_users_used: {
      /** ai đã sử dụng */
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      /** số lượng cho phép tối đa 1 user được sử dụng */
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },

    discount_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const discountModel = model(DOCUMENT_NAME, discountSchema);
export default discountModel;
