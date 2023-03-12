import { Router } from "express";
import { purchaseCart } from "../controllers/carts.controller.js";
import { getAllProducts, getCartById, getCarts, getHome, getProduct } from "../controllers/views.controller.js";

const router = Router();

router.get("/", getHome);

router.get("/products", getAllProducts);

router.get('/products/:pid', getProduct)

router.get("/carts", getCarts);

router.get("/carts/:cid", getCartById);

router.post("/cart/:cid/purchase", purchaseCart)

export { router as ViewsRouter };
