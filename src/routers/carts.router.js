import { Router } from "express";
import {
  addProductCart,
  arrayProducts,
  createCart,
  deleteProductFromCart,
  emptyCart,
  getCartByID,
  getCarts,
  purchaseCart,
} from "../controllers/carts.controller.js";
import { updateProduct } from "../controllers/products.controller.js";

const routerCart = Router();

routerCart.post("/", createCart);

routerCart.get("/", getCarts);

routerCart.get("/:cid", getCartByID);

routerCart.post("/:cid/products/:pid", addProductCart);

routerCart.delete("/:cid/products/:pid", deleteProductFromCart);

routerCart.put("/:cid", arrayProducts);

routerCart.put("/:cid/products/:pid", updateProduct);

routerCart.delete("/:cid", emptyCart);

routerCart.post("/:cid/purchase", purchaseCart)

export { routerCart as cartsRouter };
