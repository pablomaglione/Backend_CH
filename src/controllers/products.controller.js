import  ProductServices from "../services/products.services.js";
import CustomError from "../errors/customError.js";
import { ERRORS_ENUM } from "../errors/enums.js";

export const getProducts = async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;

    const filter = {
      page: page || 1,
      limit: limit || 10,
      sort: { price: sort || -1 },
      lean: true,
    };

    const products = await ProductServices.getProducts(filter, query);

    if (!products) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    res.status(200).send({
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
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

export const getProductByID = async (req, res) => {
  try {
    const { id: paramID } = req.params;

    const id = Number(paramID);

    if (Number.isNaN(id) || id < 0) {
      return res.status(401).send("ID incorrecto, deber ser un número válido");
    }

    const product = await ProductServices.getProductByID(id);

    if (!product) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(200).send({ payload: product });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
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
    const user = req.session.user;

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

    const addProduct = await ProductServices.addProduct({
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    }, user);

    if (!addProduct) {
      CustomError.createError({
        message: ERRORS_ENUM["INVALID PRODUCT PROPERTY"],
      });
    }

    return res.status(200).send({ payload: addProduct });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id: paramId } = req.params;

    const id = Number(paramId);

    if (Number.isNaN(id) || id < 0) {
      return res.status(401).send({ status: error.name, message: error.message });
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

    const updateProduct = await ProductServices.updateProduct(id, {
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    });

    if (!updateProduct) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(200).send({ payload: updateProduct });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id: paramId } = req.params;
    const user = req.session.user;

    const id = Number(paramId);

    if (Number.isNaN(id) || id < 0) {
      return res.status(401).send({ status: error.name, message: error.message });
    }

    const deleteProduct = await ProductServices.deleteProduct(id, user);

    if (!deleteProduct) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(200).send({ payload: deleteProduct });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};
