import apikeyModel from "../models/apikey.model.js";

export const findById = async (key) => {
  const objKey = await apikeyModel
    .findOne({
      key,
      status: true,
    })
    .lean();

  return objKey;
};
