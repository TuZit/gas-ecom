import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothings", "Furniture"],
    },
    product_shop: String, //{ type: Schema. Types.ObjectId, ref: 'User' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    collection: "clothings",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufactory: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

const productModel = model(DOCUMENT_NAME, productSchema);
const clothingModel = model("Clothings", clothingSchema);
const electronicModel = model("Electronics", electronicSchema);

export { productModel, clothingModel, electronicModel };
