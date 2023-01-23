import { Router } from "express";
import { productDBManager } from "../dao/Managers/index.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productDBManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export { router as ViewsRouter };
