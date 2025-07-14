import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../core/utils/authUtil.js";
import DiscountController from "../../controllers/discount.controller.js";

const router = express.Router();

router.get("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(DiscountController.getAllDiscountWithProduct)
);

/*---------- authentication ----------*/
router.use(authenticationV2);

router.post("", asyncHandler(DiscountController.createDiscountCode));
router.get("", asyncHandler(DiscountController.getAllDiscountCodes));

export default router;
