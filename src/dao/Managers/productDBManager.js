import productModel from "../models/products.model.js";

export class ProductDBManager {
  async addProduct({
    title,
    description,
    price,
    thumbail,
    code,
    status,
    stock,
    category,
  }) {
    try {
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !status ||
        !stock ||
        !category
      ) {
        return {
          error: "Completar todos los campos, son obligatorios",
        };
      }
      const newProduct = {
        title,
        description,
        price,
        thumbail,
        code,
        status,
        stock,
        category,
      };

      const existCode = await productModel.findOne({ code: code });
      if (existCode) {
        return {
          error: "Codigo existe, debe ser diferente",
        };
      }

      const product = await productModel.create(newProduct);

      if (!product) {
        return { error: "No se pudo agregar el producto a la BD" };
      }
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(filter, query) {
    try {
      const search = {};
      if (query) {
        search["$or"] = [
          { code: { $regex: query } },
          { title: { $regex: query } },
          { category: { $regex: query } },
        ];
        const products = await productModel.paginate(search, filter);
        return products;
      }

      const products = await productModel.paginate({}, filter);

      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductByID(productid) {
    const products = await productModel.findById({ _id: productid }).lean();

    if (products) return products;
  }

  async updateProduct(productid, updProd) {
    try {
      const product = await productModel.updateOne({ _id: productid }, updProd);

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(productid) {
    try {
      const product = await productModel.deleteOne({ _id: productid });

      return product;
    } catch (error) {
      console.log(error);
    }
  }
}
