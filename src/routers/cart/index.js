import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../core/utils/authUtil.js";
import cartController from "../../controllers/cart.controller.js";

const router = express.Router();

router.get("", asyncHandler(cartController.listCart));
router.post("", asyncHandler(cartController.addToCart));

/*---------- authentication ----------*/
// router.use(authenticationV2);

router.post("/update", asyncHandler(cartController.updateCart));
router.delete("", asyncHandler(cartController.deleteCart));

export default router;
