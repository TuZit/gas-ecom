import { BadRequestError } from "../core/response-handler/error.response.js";
import {
  removeEmptyProperty,
  updateNestedObjectParser,
} from "../core/utils/object.js";
import {
  productModel,
  clothingModel,
  electronicModel,
} from "../models/product.model.js";
import { insertInventory } from "../models/repositories/inventory.repository.js";
import {
  publishProductByShop,
  queryProduct,
  searchProductsByUser,
  findAllProducts,
  findProductByID,
  updateProductById,
} from "../models/repositories/product.repository.js";
import { pushNotiToSystem } from "./notification.service.js";

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

  static async updateProduct(type, payload) {
    const productClass = ProductFactoryServices.producRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid Product Type ", type);
    return new productClass(payload).updateProduct(payload.product_id);
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
    try {
      const newProduct = await productModel.create({
        ...this,
        _id: product_id,
      });
      if (newProduct) {
        await insertInventory({
          product_id: newProduct._id,
          shop_id: newProduct.product_shop,
          stock: this.product_quantity,
        });

        // push noti to system collection
        const noti = await pushNotiToSystem({
          type: "SHOP-001",
          options: {
            product_name: this.product_name,
            shop_name: this.product_shop,
            product_type: this.product_type,
          },
          receivedId: 11111,
          senderId: this.product_shop,
        });
        console.log("shiba", noti);
      }
      return newProduct;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({
      product_id,
      bodyUpdate,
      model: productModel,
    });
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

  async updateProduct(product_id) {
    // 1. remove attributes has null or undefined
    const objectParams = removeEmptyProperty(this);

    // 2. check where to update?
    if (objectParams.product_attributes) {
      // update child collection (clothing)
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothingModel,
      });
    }
    // 3. update parent collection (product)
    const updatePayload = updateNestedObjectParser(objectParams);
    const updatedProduct = await super.updateProduct(product_id, updatePayload);
    return updatedProduct;
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

  async updateProduct(product_id) {
    // 1. remove attributes has null or undefined
    const objectParams = removeEmptyProperty(this);

    // 2. check where to update?
    if (objectParams.product_attributes) {
      // update child collection (electronic)
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronicModel,
      });
    }
    // 3. update parent collection (product)
    const updatePayload = updateNestedObjectParser(objectParams);
    const updatedProduct = await super.updateProduct(product_id, updatePayload);
    return updatedProduct;
  }
}

// register product types
ProductFactoryServices.registerProductTYpe("Electronics", ElectronicProduct);
ProductFactoryServices.registerProductTYpe("Clothings", ClothingProduct);

export default ProductFactoryServices;
