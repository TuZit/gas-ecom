import { OK } from "../core/response-handler/success.response.js";
import CartService from "../services/cart.service.js";

class CartController {
  async addToCart(req, res, next) {
    new OK({
      message: "Create new cart successfully!",
      metadata: await CartService.addToCart(req.body ?? {}),
    }).send(res);
  }

  async updateCart(req, res, next) {
    new OK({
      message: "Update cart successfully!",
      metadata: await CartService.addToCartV2(req.body ?? {}),
    }).send(res);
  }

  async deleteCart(req, res, next) {
    new OK({
      message: "Deleted cart successfully!",
      metadata: await CartService.deleteCart({
        ...req.body,
      }),
    }).send(res);
  }

  async listCart(req, res, next) {
    new OK({
      message: "Get list cart successfully!",
      metadata: await CartService.getListCart({
        userId: req.query.id,
      }),
    }).send(res);
  }
}

export default new CartController();
