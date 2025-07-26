import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import notificationController from "../../controllers/notification.controller.js";

const router = express.Router();

router.get("", asyncHandler(notificationController.listNotiByUser));

export default router;
