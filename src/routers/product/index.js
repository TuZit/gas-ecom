import ProductController from "../../controllers/product.controller.js";
import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";

const router = express.Router();

router.post("/api/product", asyncHandler(ProductController.createProduct));
router.get("/api/product", asyncHandler(ProductController.getProducts));
router.put("/api/product", asyncHandler(ProductController.updateProduct));

export default router;
