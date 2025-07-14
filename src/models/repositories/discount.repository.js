import {
  convertObjectIdMongodb,
  getUn_SelectData,
} from "../../core/utils/object.js";
import discountModel from "../discount.model.js";

export const findDiscountByShop = async ({ code, shopId }) => {
  return await discountModel.findOne({
    discount_code: code,
    discount_shopId: convertObjectIdMongodb(shopId),
  });
};

export const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUn_SelectData(unSelect))
    .lean();
};

export const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .selet(getSelectData(select))
    .lean();
};

export const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};
