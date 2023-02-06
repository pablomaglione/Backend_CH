import { Router } from "express";
import { productDBManager } from "../dao/Managers/index.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;

    const filter = {
      page: page || 1,
      limit: limit || 10,
      sort: { price: sort || -1 },
      lean: true,
    };

    const products = await productDBManager.getProducts(filter, query);

    res.send({
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
    res.send({ success: false, error: "Ha ocurrido un error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id: paramID } = req.params;

    const id = Number(paramID);
    //console.log(id);
    if (Number.isNaN(id) || id < 0) {
      return res.send({
        success: false,
        error: "ID incorrecto, deber ser un número válido",
      });
    }

    const product = await productDBManager.getProductByID(id);

    if (!product) {
      return res.send({ success: false, error: "Producto no encontrado" });
    }
    res.send({ success: true, product });
  } catch (error) {
    console.log(error);

    res.send({ success: false, error: "ERROR" });
  }
});

router.post("/", async (req, res) => {
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
      return res.send({
        success: false,
        error: "Completar todos los campos, son obligatorios",
      });
    }

    const addProduct = await productDBManager.addProduct({
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    });

    req.app
      .get("io")
      .sockets.emit("products", await productDBManager.getProducts());

    res.send({ success: true, product: addProduct });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id: paramId } = req.params;

    const id = Number(paramId);

    if (Number.isNaN(id) || id < 0) {
      return res.send({
        success: false,
        error: "El id debe ser un número válido",
      });
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

    const updateProduct = await productDBManager.updateProduct(id, {
      title,
      description,
      price,
      thumbail,
      code,
      status,
      stock,
      category,
    });

    res.send({ success: true, product: updateProduct });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id: paramId } = req.params;

    const id = Number(paramId);

    if (Number.isNaN(id) || id < 0) {
      return res.send({
        success: false,
        error: "El id debe ser un número válido",
      });
    }

    const deleteProduct = await productDBManager.deleteProduct(id);

    res.send({ success: true, deleted: deleteProduct });
  } catch (error) {
    console.log(error);
  }
});

export { router as productsRouter };
