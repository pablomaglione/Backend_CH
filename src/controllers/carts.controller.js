import CartServices from "../services/carts.services.js";
import { ERRORS_ENUM } from "../errors/enums.js";
import CustomError from "../errors/customError.js";

export const createCart = async (req, res) => {
  try {
    await CartServices.createCart();
    res.status(200).send({
      message: "Carrito creado"
    });
  } catch (error) {
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await CartServices.getCarts();

    if (!carts){
      CustomError.createError({
        message: ERRORS_ENUM["CART IS EMPTY"]
      })
    }
    return res.status(200).send({
      success: true,
      payload: carts,
    });
  } catch (error) {
    return res.status(400).send({status: error.name, message: error.message});
  }
};

export const getCartByID = async (req, res) => {
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

    const cart = await CartServices.getCartByID(id);

    if (!cart) {
      CustomError.createError({
        message: ERRORS_ENUM["CART NOT FOUND"]
      })
    }
  
    res.status(200).send({
      success: true,
      payload: cart,
    });
  } catch (error) {
      return res.status(400).send({status: error.name, message: error.message});
  }
};

export const addProductCart = async (req, res) => {
  try {
    const { cid: cartId } = req.params;

    const cid = Number(cartId);

    if (Number.isNaN(cid) || cid < 0) {
      return res.status(401).send({
        success: false,
        error: "El id del carrito ingresado es invalido",
      });
    }

    const { pid: productId } = req.params;

    const pid = Number(productId);

    if (Number.isNaN(pid) || pid < 0) {
      return res.status(401).send({
        success: false,
        error: "El id del producto ingresado es invalido",
      });
    }

    const productAddedCart = await CartServices.addProductCart(cid, pid);

    if(!productAddedCart){
      CustomError.createError({
        message: ERRORS_ENUM["INVALID CART PROPERTY"]
      })
    }
    
    res.status(200).send({
      success: true,
      payload: productAddedCart,
    });
  } catch (error) {
    return res.status(400).send({status: error.name, message: error.message});
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await CartServices.deleteProductFromCart(cid, pid);

    if(!result){
      CustomError.createError({
        message: ERRORS_ENUM["INVALID CART PROPERTY"]
      })
    }

    res.status(401).send({
      success: true,
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({status: error.name, message: error.message});
  }
};

export const arrayProducts = async (req, res) => {
  try {
    const { cid } = req.params;

    const productToReplace = req.body;

    const result = await CartServices.arrayProducts(cid, productToReplace);

    res.status(200).send({
      success: true,
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({status: error.name, message: error.message});
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;

    const result = await CartServices.updateQuantity(quantity, cid, pid);
    
    if(!result){
      CustomError.createError({
        message: ERRORS_ENUM["INVALID CART PROPERTY"]
      })
    }
    
    res.status(200).send({
      success: true,
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({status: error.name, message: error.message});
  }
};

export const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await CartServices.emptyCart(cid);

    res.status(200).send({
      success: true,
      payload: result,
    });
  } catch (error) {
     return res.status(400).send({status: error.name, message: error.message});
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await CartServices.purchaseProducts(cid);

    if(!result){
      CustomError.createError({
        message: ERRORS_ENUM["INVALID CART PROPERTY"]
      })
    }

    res.status(200).send({
      success: true,
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({status: error.name, message: error.message});
  }
};
