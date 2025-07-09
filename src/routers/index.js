import express from "express";
import accessController from "../controllers/access.controller.js";
import { apiKey, checkPermission } from "../auth/checkAuth.js";
import { asyncHandler } from "../helpers/asyncHandler.js";
import { authentication, authenticationV2 } from "../core/utils/authUtil.js";

import productRouter from "./product/index.js";
import accessRouter from "./access/index.js";

const router = express.Router();

/*---------- check API key ----------*/
router.use(apiKey);

/*---------- permission ----------*/
router.use(checkPermission("0000"));

/*---------- access routers ----------*/
router.use(accessRouter);

/*---------- authentication ----------*/
router.use(authenticationV2);

router.post("/api/logout", asyncHandler(accessController.logout));
router.post(
  "/api/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

/*---------- product routes ----------*/
router.use(productRouter);

export default router;
