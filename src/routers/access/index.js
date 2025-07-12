import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../core/utils/authUtil.js";

const router = express.Router();

router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

/*---------- authentication ----------*/
router.use(authenticationV2);

router.post("/api/logout", asyncHandler(accessController.logout));
router.post(
  "/api/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

export default router;
