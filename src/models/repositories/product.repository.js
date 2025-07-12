import { Types } from "mongoose";
import {
  clothingModel,
  electronicModel,
  productModel,
} from "../../models/product.model.js";

export const publishProductByShop = async ({
  product_shop,
  product_id,
  isPublished,
}) => {
  const product = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!product) return null;

  product.isDraft = !isPublished;
  product.isPublished = isPublished;
  const data = await product.updateOne(product);
  return data;
};

export const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await productModel
    .find(
      {
        $text: {
          $search: regexSearch,
        },
        isPublished: true,
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
    .sort()
    .lean();

  return result;
};
