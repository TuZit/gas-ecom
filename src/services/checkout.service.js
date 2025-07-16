import {
  BadRequestError,
  NotFoundError,
} from "../core/response-handler/error.response.js";
import { findCartById } from "../models/repositories/cart.repository.js";
import { checkProductByServer } from "../models/repositories/product.repository.js";
import DiscountService from "./discount.service.js";

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart does not exits");

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shopOrerIdsNew = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product avaiable
      const checkProductServer = await checkProductByServer(item_products);
      console.log("checkProductServer", checkProductServer);
      if (!checkProductServer) throw new BadRequestError("Order wrong!");

      const checkoutPrice = checkProductServer.reduce(
        (acc, prd) => acc + (prd.quantity ?? 0) * (prd.price ?? 0),
        0
      );

      // tong tien trc khi xu ly
      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // nếu shop_discounts tồn tại > 0, check hợp lệ
      if (shop_discounts.length > 0) {
        const { totalPrice, totalAmount, discount } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            products: checkProductServer,
            shopId,
            userId,
          });

        //tổng cộng discount giả giá
        checkoutOrder.totalDiscount += discount;
        // nếu tiền giảm giá > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tổng thanh toán cuối cùng
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shopOrerIdsNew.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new: shopOrerIdsNew,
      checkout_order: checkoutOrder,
    };
  }
}

export default CheckoutService;
