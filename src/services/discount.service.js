import {
  BadRequestError,
  NotFoundError,
} from "../core/response-handler/error.response.js";
import discountModel from "../models/discount.model.js";
import { convertObjectIdMongodb } from "../core/utils/object.js";
import {
  checkDiscountExists,
  findAllDiscountCodesUnSelect,
  findDiscountByShop,
} from "../models/repositories/discount.repository.js";
import { findAllProducts } from "../models/repositories/product.repository.js";

/**
 * 1. Discount generator [Shop | Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount [Shop | Admin]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop | Admin]
 * 6. Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name,
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
    //   throw new BadRequestError("Discount code has expired!");

    if (new Date(start_date) > new Date(end_date))
      throw new BadRequestError("Start date must be before end date");

    // create index for discount code
    const foundDiscount = await findDiscountByShop({ code, shopId });
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already existed!");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to == "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscount() {}

  static async getAllDiscountWithProduct({
    code,
    shopId,
    userId,
    limit = 50,
    page = 1,
  }) {
    const foundDiscount = await findDiscountByShop({ code, shopId });
    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotFoundError("Discount code not found");

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    if (discount_applies_to == "all") {
      // get all products
      const products = await findAllProducts({
        filter: {
          isPublished: true,
          //   product_shop: convertObjectIdMongodb(shopId),
          _id: {
            $in: discount_product_ids,
          },
        },
        limit,
        page,
        sort: "ctime",
        select: ["product_name", "product_price"],
      });
      return products;
    }
    if (discount_applies_to == "specific") {
      // get product with ids
      const products = await findAllProducts({
        filter: {
          isPublished: true,
          _id: {
            $in: discount_product_ids,
          },
        },
        limit,
        page,
        sort: "ctime",
        select: ["product_name", "product_price"],
      });
      return products;
    }
  }

  static async getAllDiscountByShop({
    code,
    shopId,
    userId,
    limit = 50,
    page = 1,
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      unSelect: ["__v", "discount_shopId"],
      limit,
      page,
      filter: {
        discount_shopId: convertObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      model: discountModel,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found");

    const {
      discount_is_active,
      discount_max_uses,
      discount_end_date,
      discount_start_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
      discount_name,
    } = foundDiscount;

    if (!discount_is_active)
      throw new NotFoundError("Discount code has expired ");

    if (!discount_max_uses) throw new NotFoundError("Discount code is out");

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // )
    //   throw new BadRequestError("Discount code has expired!");

    // check giá trị đơn hàng
    let totalAmount = 0;
    if (discount_min_order_value > 0) {
      totalAmount = products?.reduce(
        (acc, prd) => acc + prd.price * prd.quantity,
        0
      );
      if (totalAmount < discount_min_order_value)
        throw new NotFoundError(
          `Discount require a minium order value of ${discount_min_order_value}`
        );
    }

    if (discount_max_uses_per_user > 0) {
      const userUsed = discount_users_used?.find(
        (user) => user.userId == userId
      );
    }

    // check fixed_amount hay ...
    const amount =
      discount_type === " fixed_amount"
        ? discount_value
        : totalAmount * (discount_value / 100);

    return {
      totalAmount,
      discount: amount,
      discountCode: discount_name ?? "",
      totalPrice: totalAmount - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deletedDiscount = await discountModel.findOneAndDelete({
      discount_shopId: convertObjectIdMongodb(shopId),
      discount_code: codeId,
    });
    return deletedDiscount;
  }

  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError("Discount code not found");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

export default DiscountService;
