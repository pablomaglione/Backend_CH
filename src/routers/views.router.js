import { Router } from "express";
import { productDBManager, cartDBManager} from "../dao/Managers/index.js";
//import { productModel } from "../dao/models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
  //const products = await productDBManager.getProducts();

  res.render('home');
});

router.get("/products", async (req, res) => {
  try {
    const { page, limit, sort } = req.query;
    const query = req.query?.query || "";

    const filter = {
      page: page || 1,
      limit: limit || 10,
      sort: { price: sort || -1 },
      lean: true,
    };

    const result = await productDBManager.getProducts(filter, query);

    result.prevLink = result.hasPrevPage
      ? `/products?page=${result.prevPage}&limit=${result.limit}&query=${
          query || ""
        }&sort=${sort || -1}`
      : "";
    result.nextLink = result.hasNextPage
      ? `/products?page=${result.nextPage}&limit=${result.limit}&query=${
          query || ""
        }&sort=${sort || -1}`
      : "";

    result.isValid = !(page <= 0 || page > result.totalPages);

    res.render("products", {
      result,
      products: result.docs,
    });
  } catch (error) {
    res.send({ success: false, error: "Ha ocurrido un error" });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productDBManager.getProductByID(pid);

    res.render("products", {
      product,
    });
  } catch (error) {
    console.log(error);

    res.send({
      success: false, error: "Ha ocurrido un error"
    });
  }
})

router.get("/carts", async (req, res) => {
  try {
    //const { cid } = req.params;

    const result = await cartDBManager.getCarts();

    const cart = result.cart;

    res.render("cart", {
      cart,
    });
  } catch (error) {
    console.log(error);

    res.send({
      success: false, error: "Ha ocurrido un error"
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await Managers.CartsManager.getCartById(cid);

    const cart = result.cart;

    res.render("cart", {
      cart,
    });
  } catch (error) {
    console.log(error);

    res.send({
      success: false, error: "Ha ocurrido un error"
    });
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export { router as ViewsRouter };
