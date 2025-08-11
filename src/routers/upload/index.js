import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import uploadController from "../../controllers/upload.controller.js";
import { uploadDisk } from "../../core/configs/multer.config.js";

const router = express.Router();

router.post("/product/upload", asyncHandler(uploadController.uploadFile));

router.post(
  "/product/upload/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumbnail)
);

export default router;
