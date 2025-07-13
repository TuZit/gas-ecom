import { BadRequestError } from "../core/response-handler/error.response.js";
import {
  productModel,
  clothingModel,
  electronicModel,
} from "../models/product.model.js";
import {
  publishProductByShop,
  queryProduct,
  searchProductsByUser,
  findAllProducts,
  findProductByID,
} from "../models/repositories/product.repository.js";

class ProductFactoryServices {
  static producRegistry = {};

  static registerProductTYpe(type, classRef) {
    ProductFactoryServices.producRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactoryServices.producRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid Product Type ", type);
    return new productClass(payload).createProduct();
  }

  // QUERY
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await queryProduct({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProductByID(product_id) {
    return await findProductByID({
      product_id,
      unSelect: ["__v"],
    });
  }
  // END QUERY

  // PUT
  static async publishProductByShop({ product_shop, product_id, isPublished }) {
    return await publishProductByShop({
      product_shop,
      product_id,
      isPublished,
    });
  }
  // ENDPUT
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

  async createProduct(product_id) {
    return await productModel.create({ ...this, _id: product_id });
  }
}

class ClothingProduct extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing failed");
    return await super.createProduct(newClothing._id);
  }
}

class ElectronicProduct extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic failed");
    return await super.createProduct();
  }
}

// register product types
ProductFactoryServices.registerProductTYpe("Electronics", ElectronicProduct);
ProductFactoryServices.registerProductTYpe("Clothings", ClothingProduct);

export default ProductFactoryServices;
