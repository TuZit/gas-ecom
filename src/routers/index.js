import express from "express";
import accessController from "../controllers/access.controller.js";
import { apiKey, checkPermission } from "../auth/checkAuth.js";
import { asyncHandler } from "../helpers/asyncHandller.js";
import { authentication } from "../core/utils/authUtil.js";

const router = express.Router();

/*---------- check API key ----------*/
router.use(apiKey);

/*---------- permission ----------*/
router.use(checkPermission("0000"));

/*---------- routers ----------*/
router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

/*---------- authentication ----------*/
router.use(authentication);

router.post("/api/logout", asyncHandler(accessController.logout));
router.post(
  "/api/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

export default router;
