import DiscountService from "../services/discount.service.js";
import { OK } from "../core/response-handler/success.response.js";

class DiscountController {
  async createDiscountCode(req, res, next) {
    new OK({
      message: "Create discount code successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.id,
      }),
    }).send(res);
  }

  async getAllDiscountCodes(req, res, next) {
    new OK({
      message: "Get all discount codes successfully!",
      metadata: await DiscountService.getAllDiscountByShop({
        shopId: req.query.shopId,
        code: req.query.code,
        userId: req.query.code,
      }),
    }).send(res);
  }

  async getAllDiscountWithProduct(req, res, next) {
    new OK({
      message: "Get all discount codes successfully!",
      metadata: await DiscountService.getAllDiscountWithProduct({
        shopId: req.query.shopId,
        code: req.query.code,
      }),
    }).send(res);
  }

  async getDiscountAmount(req, res, next) {
    new OK({
      message: "Get discount amount successfully!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  }

  async deleteDiscountCode(req, res, next) {
    new OK({
      message: "Delete discount code successfully!",
      metadata: await DiscountService.deleteDiscountCode({
        ...req.body,
        shopId: req.user.id,
      }),
    }).send(res);
  }
}

export default new DiscountController();
