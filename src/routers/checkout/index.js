import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../core/utils/authUtil.js";
import checkoutController from "../../controllers/checkout.controller.js";

const router = express.Router();

/*---------- authentication ----------*/
// router.use(authenticationV2);

router.post("/review", asyncHandler(checkoutController.checkoutReview));

export default router;
