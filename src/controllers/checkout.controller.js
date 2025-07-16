import { OK } from "../core/response-handler/success.response.js";
import CheckoutService from "../services/checkout.service.js";

class CheckoutController {
  async checkoutReview(req, res, next) {
    new OK({
      message: "Checkout successfully!",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  }
}

export default new CheckoutController();
