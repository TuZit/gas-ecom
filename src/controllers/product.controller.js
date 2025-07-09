import { OK } from "../core/response-handler/success.response.js";
import ProductFactoryServices from "../services/product.service.js";

class ProductController {
  async createProduct(req, res, next) {
    new OK({
      message: "Create product successfully!",
      metadata: await ProductFactoryServices.createProduct(
        req.body.product_type,
        { ...req.body, product_shop: req.user.id }
      ),
    }).send(res);
  }

  async getProducts(req, res, next) {
    new OK({
      message: "Get products successfully!",
      //   metadata: await ProductFactoryServices.getProducts(),
      metadata: {},
    }).send(res);
  }

  async updateProduct(req, res, next) {
    new OK({
      message: "Get products successfully!",
      metadata: await ProductFactoryServices.getProducts(),
    }).send(res);
  }
}

export default new ProductController();
