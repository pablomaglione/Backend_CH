import ProductsServices from "../services/products.services.js";
import CartsServices from "../services/carts.services.js"

export const getHome = async (req, res) => {
    res.render('home');
}

export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;

    const filter = {
      page: page || 1,
      limit: limit || 10,
      sort: { price: sort || -1 },
      lean: true,
    };

    const products = await ProductsServices.getProducts(filter, query);

    //const user = req.session.user;

    products.prevLink = products.hasPrevPage
      ? `/products?page=${products.prevPage}&limit=${products.limit}&query=${
          query || ""
        }&sort=${sort || -1}`
      : "";
    products.nextLink = products.hasNextPage
      ? `/products?page=${products.nextPage}&limit=${products.limit}&query=${
          query || ""
        }&sort=${sort || -1}`
      : "";

    products.isValid = !(page <= 0 || page > products.totalPages);

    res.render("products", { products, products: result.docs });
  } catch (error) {
    req.logger.error(error);
    res.render("error");
  }
};

export const getProduct = async (req, res) => {
    try {
        const { pid } = req.params;
    
        const product = await ProductsServices.getProductByID(pid);
    
        res.render("Oneproduct", {
          product,
        });
      } catch (error) {
        req.logger.error(error);
        res.render("error");
      }
}

export const getCarts = async (req,res) => {
    try {
 
        const result = await CartsServices.getCarts();
    
        const cart = result.cart;
    
        res.render("cart", {
          cart,
        });
      } catch (error) {
        req.logger.error(error);
        res.render("error");
      }
}

export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
    
        const result = await CartsServices.getCartById(cid);
    
        const cart = result.cart;
    
        res.render("cart", {
          cart,
        });
      }catch (error) {
        req.logger.error(error);
        res.render("error");
      }
}

