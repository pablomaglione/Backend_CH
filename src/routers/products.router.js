import { Router } from "express";
import { productManager } from "../Managers/index.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    const allProducts = await productManager.getProducts();

    if (!limit || limit < 1) {
      return res.send({ success: true, products: allProducts });
    }

    const products = allProducts.slice(0, limit);

    res.send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: "Ha ocurrido un error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id: paramID } = req.params;

    const id = Number(paramID);
    console.log(id);
    if (Number.isNaN(id) || id < 0) {
      return res.send({
        success: false,
        error: "ID incorrecto, deber ser un número válido",
      });
    }

    const product = await productManager.getProductByID(id);

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

    if (!title || !description || !price || !code || !status || !stock || !category){
        return res.send({success: false, error: "Completar todos los campos, son obligatorios"});
    }

    const addProduct = await productManager.addProduct({
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
      .sockets.emit("products", await productManager.getProducts());

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

    const updateProduct = await productManager.updateProduct(id, {
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

    const deleteProduct = await productManager.deleteProduct(id);

    res.send({ success: true, deleted: deleteProduct });
  } catch (error) {
    console.log(error);
  }
});

export { router as productsRouter };
