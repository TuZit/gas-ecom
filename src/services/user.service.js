import userModel from "../models/user.model.js";

const newUser = async ({ email = null, capcha = null }) => {
  const user = userModel.findOne({ us_email: email }).lean();
  if (user) {
    throw new BadRequestError("Error: Email already existed");
  }
  // send token via email

  const newUser = await userModel.create();
  return newUser;
};
