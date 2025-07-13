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

  async getAllDraftForShop(req, res, next) {
    new OK({
      message: "Get list draft products successfully!",
      metadata: await ProductFactoryServices.findAllDraftForShop({
        product_shop: req.user.id,
      }),
    }).send(res);
  }

  async getAllPublishedForShop(req, res, next) {
    new OK({
      message: "Get list published products successfully!",
      metadata: await ProductFactoryServices.findAllPublishedForShop({
        product_shop: req.user.id,
      }),
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    new OK({
      message: "Get list products successfully!",
      metadata: await ProductFactoryServices.searchProducts({
        keySearch: req.params.keysearch,
      }),
    }).send(res);
  }

  async publishProductByShop(req, res, next) {
    new OK({
      message: `${
        req.body.isPublished ? "Published" : "Un-Published"
      } product successfully!`,
      metadata: await ProductFactoryServices.publishProductByShop({
        product_shop: req.user.id,
        product_id: req.params.id,
        isPublished: req.body.isPublished,
      }),
    }).send(res);
  }

  async findAllProducts(req, res, next) {
    new OK({
      message: "Get list all products successfully",
      metadata: await ProductFactoryServices.findAllProducts(req.body ?? {}),
    }).send(res);
  }

  async findProductByID(req, res, next) {
    new OK({
      message: "Find product by ID successfully",
      metadata: await ProductFactoryServices.findProductByID(
        req.params.product_id
      ),
    }).send(res);
  }
}

export default new ProductController();
