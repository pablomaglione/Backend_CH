import { Router } from "express";
import { Auth } from "../utils/auth.js";
import {
  addProduct,
  deleteProduct,
  getProductByID,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProductByID);

router.post("/", Auth("admin"), addProduct);

router.put("/:id", Auth("admin"), updateProduct);

router.delete("/:id", Auth("admin"), deleteProduct);

export { router as productsRouter };
