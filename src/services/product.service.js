import { BadRequestError } from "../core/response-handler/error.response.js";
import {
  productModel,
  clothingModel,
  electronicModel,
} from "../models/product.model.js";

class ProductFactoryServices {
  // type: clothing/electronic
  // payload

  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return await new ElectronicProduct(payload).createProduct();
      case "Clothings":
        return await new ClothingProduct(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct() {
    return await productModel.create(this);
  }
}

class ClothingProduct extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing failed");
    return await super.createProduct();
  }
}

class ElectronicProduct extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Create new electronic failed");
    return await super.createProduct();
  }
}

export default ProductFactoryServices;
