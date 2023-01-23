import { ProductManager } from "./productManager.js";
import { CartManager } from "./cartManager.js";

export const productManager = new ProductManager("./src/db/products.json");
export const cartManager = new CartManager("./src/db/carts.json");