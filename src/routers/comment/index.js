import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import commentController from "../../controllers/comment.controller.js";

const router = express.Router();

router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getAllComments));
router.post("/parent", asyncHandler(commentController.getCommentByParentId));

export default router;
