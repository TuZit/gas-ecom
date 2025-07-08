import express from "express";
import accessController from "../controllers/access.controller.js";
import { apiKey, asyncHandler, checkPermission } from "../auth/checkAuth.js";

const router = express.Router();

// using middleware check apiKey
router.use(apiKey);

// check permission
router.use(checkPermission("0000"));

// routers
router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

export default router;
