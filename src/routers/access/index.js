import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

const router = express.Router();

router.post("/api/sign-up", asyncHandler(accessController.signUp));
router.post("/api/login", asyncHandler(accessController.login));

export default router;
