import express from "express";

import ProductController from "../../controllers/product.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../core/utils/authUtil.js";

const router = express.Router();

router.post(
  "/api/product/search/:keysearch",
  asyncHandler(ProductController.getListSearchProduct)
);
router.post("/api/products", asyncHandler(ProductController.findAllProducts));
router.post(
  "/api/product/:product_id",
  asyncHandler(ProductController.findProductByID)
);

/*---------- authentication ----------*/
router.use(authenticationV2);

router.post("/api/product", asyncHandler(ProductController.createProduct));
router.get("/api/product", asyncHandler(ProductController.getProducts));
router.put("/api/product", asyncHandler(ProductController.updateProduct));

router.get(
  "/api/product/drafts",
  asyncHandler(ProductController.getAllDraftForShop)
);
router.get(
  "/api/product/published",
  asyncHandler(ProductController.getAllPublishedForShop)
);
router.post(
  "/api/product/published/:id",
  asyncHandler(ProductController.publishProductByShop)
);

export default router;
