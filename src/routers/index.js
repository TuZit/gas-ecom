import express from "express";

import { apiKey, checkPermission } from "../auth/checkAuth.js";
import accessController from "../controllers/access.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import discountRouter from "./discount/index.js";
import cartRouter from "./cart/index.js";
import checkoutRouter from "./checkout/index.js";
import inventoryRouter from "./inventory/index.js";

const router = express.Router();

/*---------- check API key ----------*/
router.use(apiKey);

router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

/*---------- permission ----------*/
router.use(checkPermission("0000"));

/*---------- checkout routers ----------*/
router.use("/api/checkout", checkoutRouter);

/*---------- discount routers ----------*/
router.use("/api/discount", discountRouter);

/*---------- inventory routers ----------*/
router.use("/api/inventory", inventoryRouter);

/*---------- cart routers ----------*/
router.use("/api/cart", cartRouter);

/*---------- product routes ----------*/
router.use(productRouter);

/*---------- access routers ----------*/
router.use(accessRouter);

export default router;
