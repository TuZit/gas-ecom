import express from "express";
import { apiKey, checkPermission } from "../auth/checkAuth.js";

import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import accessController from "../controllers/access.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = express.Router();

/*---------- check API key ----------*/
router.use(apiKey);

router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

/*---------- permission ----------*/
router.use(checkPermission("0000"));

/*---------- product routes ----------*/
router.use(productRouter);

/*---------- access routers ----------*/
router.use(accessRouter);

export default router;
