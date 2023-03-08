import productModel from "../models/products.model.js";

class ProductsServices {
  getProducts = async (filter, query) => {
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
  };

  getProductsByID = async (productid) => {
    try {
      const products = await productModel.findById({ _id: productid }).lean();

      if (!products) {
        throw new Error("Producto No encontrado");
      }
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (
    title,
    description,
    price,
    thumbail,
    code,
    status,
    stock,
    category
  ) => {
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
      const existCode = await productModel.findOne({ code: code }).lean();
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
  };

  updateProduct = async (productid, updProd) => {
    try {
      const product = await productModel.updateOne({ _id: productid }, updProd);

      return product;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (productid) => {
    try {
      const product = await productModel.deleteOne({ _id: productid });

      return product;
    } catch (error) {
      console.log(error);
    }
  };

  updateStock = async (pid, quantity) => {
    try {
      const product = await this.getProductsByID(pid);

      if (product.stock < quantity) {
        console.log("Stock insuficiente");

        return false;
      }

      await productModel.updateOne(
        { _id: pid },
        { $inc: { stock: -quantity } }
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  };
}

const ProductServices = new ProductsServices();

export default ProductServices;
