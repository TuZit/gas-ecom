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
import commentRouter from "./comment/index.js";
import notificationRouter from "./notification/index.js";
import uploadRouter from "./upload/index.js";
import profileRouter from "./profile/index.js";
import rbacRouter from "./rbac/index.js";

const router = express.Router();

router.use("/api", uploadRouter);

/*---------- check API key ----------*/
router.use(apiKey);

router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

/*---------- permission ----------*/
router.use(checkPermission("0000"));

router.use("/api/profile", profileRouter);
router.use("/api/rbac", rbacRouter);

/*---------- comment routers ----------*/
router.use("/api/comment", commentRouter);

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

/*---------- notification routers ----------*/
router.use("/api/notification", notificationRouter);

export default router;
