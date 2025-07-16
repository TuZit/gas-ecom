import { convertObjectIdMongodb } from "../../core/utils/object.js";
import cartModel from "../cart.model.js";

export const findCartById = async (cartID) => {
  return await cartModel.findOne({
    _id: convertObjectIdMongodb(cartID),
    cart_state: "active",
  });
};
