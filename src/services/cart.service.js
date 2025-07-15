import { NotFoundError } from "../core/response-handler/error.response.js";
import cartModel from "../models/cart.model.js";
import { clothingModel } from "../models/product.model.js";
import { findProductByID } from "../models/repositories/product.repository.js";

class CartService {
  static async createUserCart({ userId, product = {} }) {
    const query = { cart_userId: userId, cart_state: "active" };
    return await cartModel.findOneAndUpdate(
      query,
      {
        $addToSet: {
          cart_products: product,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  static async updateUserCartQuantity({ userId, product = {} }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };

    return await cartModel.findOneAndUpdate(
      query,
      {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({
      cart_userId: userId,
    });
    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // cart exited, but not includes this product
    if (
      !userCart.cart_products.some((p) => p.productId === product.productId)
    ) {
      userCart.cart_products.push(product);
      // Tăng số lượng sản phẩm trong giỏ hàng lên 1
      userCart.cart_count_product = (userCart.cart_count_product || 0) + 1;
      return await userCart.save();
    }

    // cart exited, inclues this product -> update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids = [] }) {
    console.log("shiba", userId, "-----", shop_order_ids);
    const { quantity, old_quantity, productId } =
      shop_order_ids?.[0]?.item_products?.[0];
    const foundProduct = await findProductByID({
      product_id: productId,
      unSelect: ["__v"],
    });
    if (!foundProduct) throw new NotFoundError("Product not found");

    if (foundProduct.product_shop.toString() !== shop_order_ids?.[0]?.shopId)
      throw new NotFoundError("Product do not belong to shop");

    if (quantity == 0) {
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    return await cartModel.updateOne(query, {
      $pull: {
        cart_products: {
          productId,
        },
      },
    });
  }

  static async getListCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: userId,
      })
      .select(["cart_state", "cart_userId", "cart_products", "_id"]);
  }
}

export default CartService;
