import { Router } from "express";
import { cartDBManager } from "../dao/Managers/index.js";

const routerCart = Router();

routerCart.post("/", async (req, res) => {
  try {
    const addCart = await cartDBManager.createCart();
    res.send({
      success: true,
      productCart: addCart,
    });
  } catch (error) {
    console.log(error);
  }
});

routerCart.get("/", async (req, res) => {
  const carts = await cartDBManager.getCarts();

  res.send({
    success: true,
    carts,
  });
});

routerCart.get("/:cid", async (req, res) => {
  try {
    const { cid: paramID } = req.params;

    const id = Number(paramID);
    console.log(id);
    if (Number.isNaN(id) || id < 0) {
      return res.send({
        success: false,
        error: "ID incorrecto, deber ser un número válido",
      });
    }

    const cart = await cartDBManager.getCartByID(id);

    if (!cart) {
      return res.send({
        success: false,
        error: "Producto no encontrado",
      });
    }
    res.send({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);

    res.send({
      success: false,
      error: "ERROR",
    });
  }
});

routerCart.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid: cartId } = req.params;

    const cid = Number(cartId);

    if (Number.isNaN(cid) || cid < 0) {
      return res.send({
        succes: false,
        error: "El id del carrito ingresado es invalido",
      });
    }

    const { pid: productId } = req.params;

    const pid = Number(productId);

    if (Number.isNaN(pid) || pid < 0) {
      return res.send({
        succes: false,
        error: "El id del producto ingresado es invalido",
      });
    }

    const productAddedCart = await cartDBManager.addProductCart(cid, pid);

    res.send({
      succes: true,
      product: productAddedCart,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error: "Ocurrio un error",
    });
  }
});

routerCart.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await cartDBManager.deleteProductFromCart(cid, pid);

    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      success: false,
      error: "ERROR",
    });
  }
});

routerCart.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const productToReplace = req.body;

    const result = await cartDBManager.arrayProducts(cid, productToReplace);

    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: "ERROR",
    });
  }
});

routerCart.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;

    const result = await cartDBManager.updateQuantity(quantity, cid, pid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: "ERROR",
    });
  }
});

routerCart.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await cartDBManager.emptyCart(cid);

    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: "ERROR",
    });
  }
});

export { routerCart as cartsRouter };
