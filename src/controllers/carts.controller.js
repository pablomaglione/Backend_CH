import CartServices from "../services/carts.services.js";

export const createCart = async (req, res) => {
  try {
    const addCart = await CartServices.createCart();
    return res.status(200).send({
      success: true,
      productCart: addCart,
    });
  } catch (error) {
    console.log(error);
    return res.static(400).send({ error: "Ha ocurrido un error" });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await CartServices.getCarts();

    return res.status(200).send({
      payload: carts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Ha ocurrido un error");
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
      return res.status(401).send({
        success: false,
        error: "Producto no encontrado",
      });
    }
    return res.status(200).send({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Ha ocurrido un error");
  }
};

export const addProductCart = async (req, res) => {
  try {
    const { cid: cartId } = req.params;

    const cid = Number(cartId);

    if (Number.isNaN(cid) || cid < 0) {
      return res.status(401).send({
        succes: false,
        error: "El id del carrito ingresado es invalido",
      });
    }

    const { pid: productId } = req.params;

    const pid = Number(productId);

    if (Number.isNaN(pid) || pid < 0) {
      return res.status(401).send({
        succes: false,
        error: "El id del producto ingresado es invalido",
      });
    }

    const productAddedCart = await CartServices.addProductCart(cid, pid);

    return res.status(200).send({
      succes: true,
      product: productAddedCart,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Ha ocurrido un error");
  }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
    
        const result = await CartServices.deleteProductFromCart(cid, pid);
    
        res.status(401).send({
          status: "success",
          payload: result,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send("Ha ocurrido un error");
      }
}

export const arrayProducts = async (req, res) => {
    try {
        const { cid } = req.params;
    
        const productToReplace = req.body;
    
        const result = await CartServices.arrayProducts(cid, productToReplace);
    
        res.status(200).send({
          status: "success",
          payload: result,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send("Ha ocurrido un error");
      }
}

export const updateQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { cid, pid } = req.params;
    
        const result = await CartServices.updateQuantity(quantity, cid, pid);
        res.status(200).send({
          status: "success",
          payload: result,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send("Ha ocurrido un error");
      }
}

export const emptyCart = async (req, res) => {
    try {
        const { cid } = req.params;
    
        const result = await CartServices.emptyCart(cid);
    
        res.status(200).send({
          status: "success",
          payload: result,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send("Ha ocurrido un error");
      }
}