import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../core/utils/authUtil.js";
import inventoryController from "../../controllers/inventory.controller.js";

const router = express.Router();

/*---------- authentication ----------*/
router.use(authenticationV2);

router.post("", asyncHandler(inventoryController.addStockToInventory));

export default router;
