import cartModel from "../models/cart.model";

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
      return await CartService.createUserCart({ userId, product: {} });
    }

    // cart exited, but not includes this product
    if (!userCart.cart_count_product.length) {
      userCart.cart_count_product = [product];
      return await userCart.save();
    }

    // cart exited, inclues this product -> update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCart({ userId, product = {} }) {
    // const userCart =
  }
}

export default CartService;
