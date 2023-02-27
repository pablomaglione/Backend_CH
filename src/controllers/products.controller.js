import { ProductsServices } from "../services/products.services.js";

export const getProducts = async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;

    const filter = {
      page: page || 1,
      limit: limit || 10,
      sort: { price: sort || -1 },
      lean: true,
    };

    const products = await ProductsServices.getProducts(filter, query);

    return res.status(200).send({
      status: "Success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}`
        : null,
    });
  } catch (error) {
    return res.status(400).send("Ha ocurrido un error");
  }
};

export const getProductByID = async (req, res) => {
  try {
    const { id: paramID } = req.params;

    const id = Number(paramID);

    if (Number.isNaN(id) || id < 0) {
      return res.status(401).send("ID incorrecto, deber ser un número válido");
    }

    const product = await ProductsServices.getProductByID(id);

    if (!product) {
      return res.status(401).send("Producto no encontrado");
    }
    return res.status(200).send({ payload: product });
  } catch (error) {
    console.log(error);

    return res.status(400).send("Ha ocurrido un error");
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbail,
      code,
      status = true,
      stock,
      category,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !status ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .send("Completar todos los campos, son obligatorios");
    }

    const addProduct = await ProductsServices.addProduct({
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    });

    return res.status(200).send({ payload: addProduct });
  } catch (error) {
    return res.status(400).send("Ha ocurrido un error");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id: paramId } = req.params;

    const id = Number(paramId);

    if (Number.isNaN(id) || id < 0) {
      return res.status(401).send("El id debe ser un número válido");
    }

    const {
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    } = req.body;

    const updateProduct = await ProductsServices.updateProduct(id, {
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    });

    return res.status(200).send({ payload: updateProduct });
  } catch (error) {
    return res.status(400).send("Ha ocurrido un error");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id: paramId } = req.params;

    const id = Number(paramId);

    if (Number.isNaN(id) || id < 0) {
      return res.status(401).send("El id debe ser un número válido");
    }

    const deleteProduct = await ProductsServices.deleteProduct(id);

    return res.status(200).send({ payload: deleteProduct });
  } catch (error) {
    return res.status(400).send("Ha ocurrido un error");
  }
};
