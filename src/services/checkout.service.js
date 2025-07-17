import {
  BadRequestError,
  NotFoundError,
} from "../core/response-handler/error.response.js";
import { findCartById } from "../models/repositories/cart.repository.js";
import { checkProductByServer } from "../models/repositories/product.repository.js";
import DiscountService from "./discount.service.js";
import { acquireLock, releaseLock } from "./redis.service.js";
import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import inventoryModel from "../models/inventory.model.js";

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

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address,
    user_payment,
  }) {
    const { checkout_order, shop_order_ids_new } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    // check lai ton kho Inventory
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquiredProduct = [];

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, cartId, quantity);
      acquiredProduct.push(keyLock ? true : false);

      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check nếu có 1 sp hết hàng trong kho
    if (acquiredProduct.includes(false)) {
      throw new BadRequestError(
        "Some Product is out of stock. Please update your cart..."
      );
    }
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_cartId: cartId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // Nếu insert thành công -> remove product trong cart
    if (newOrder) {
      const productIdsToRemove = products.map((p) => p.productId);
      // Xóa các sản phẩm đã order khỏi giỏ hàng
      await cartModel.updateOne(
        { _id: cartId, cart_userId: userId },
        {
          $pull: {
            cart_products: {
              productId: { $in: productIdsToRemove },
            },
          },
          $inc: {
            cart_count_product: -productIdsToRemove.length,
          },
        }
      );
    }

    return newOrder;
  }

  //Query Orders by User
  static async getOrdersByUser({ userId, limit = 50, page = 1 }) {
    const skip = (page - 1) * limit;
    const orders = await orderModel
      .find({ order_userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return orders;
  }

  //Query Orders by User
  static async getOneOrderByUser({ orderId, userId }) {
    const order = await orderModel.findOne({
      _id: orderId,
      order_userId: userId,
    });
    if (!order) throw new NotFoundError("Order not found!");
    return order;
  }

  //Cancel Orders by User
  static async cancelOrderByUser({ orderId, userId }) {
    const order = await orderModel.findOne({
      _id: orderId,
      order_userId: userId,
    });
    if (!order) throw new NotFoundError("Order not found");
    if (order.order_status !== "pending") {
      throw new BadRequestError("Cannot cancel this order!");
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      order._id,
      {
        order_status: "cancelled",
      },
      { new: true }
    );

    // Khôi phục lại số lượng hàng trong kho (un-reserve inventory)
    if (updatedOrder) {
      for (const shopOrder of order.order_products) {
        for (const product of shopOrder.item_products) {
          const { productId, quantity } = product;
          await inventoryModel.updateOne(
            { inventory_productId: productId },
            { $inc: { inventory_stock: quantity } }
          );
        }
      }
    }
    return updatedOrder;
  }

  //Update Orders by Shop | Admin
  static async updateOrderStatus({ orderId, status }) {
    const order = await orderModel.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");

    // Logic check quyền của Shop/Admin có thể thêm ở đây

    return await orderModel.findByIdAndUpdate(
      orderId,
      { order_status: status },
      { new: true }
    );
  }
}

export default CheckoutService;
