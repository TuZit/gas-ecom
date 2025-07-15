import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            enum: ['active', 'pending', 'failed', 'completed'],
            default: "active",
        },
        cart_products: {
            type: Array,
            required: true,
            default: [],
        },
        cart_count_product: {
            type: Number,
            default: 0,
        },
        cart_userId: {
            type: String | Number,
            required: true,
        },

    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const cartModel = model(DOCUMENT_NAME, cartSchema);
export default cartModel;
