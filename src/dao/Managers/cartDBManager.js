import cartModel from "../models/carts.model.js";

export class CartDBManager {
  async createCart() {
    try {
      const newCart = {
        products: [],
      };

      const result = await cartModel.create(newCart);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductCart(cid, pid) {
    try {
      const productInCart = await cartModel.findOne({ "product.id": pid });

      if (productInCart) {
        const upgQuatity = await cartModel.updateOne(
          { _id: cid },
          { $inc: { "product.quatity": 1 } }
        );
        return upgQuatity;
      } else {
        const addProduct = await cartModel.updateOne(
          { _id: cid },
          { $push: { product: { id: pid } } }
        );

        return addProduct;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCarts() {
    const carts = await cartModel.find();

    if (carts) {
      return carts;
    } else {
      return {
        error: "No existen Carritos",
      };
    }
  }

  async getCartByID(cid) {
    const cart = await cartModel.findOne({ cid });

    if (cart) return cart;
    else
      return {
        error: "No existe Carrito con ese ID",
      };
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const deleteOne = await cartModel.updateOne(
        { _id: cid },
        {
          $pull: {
            cart: { product: pid },
          },
        }
      );

      return deleteOne;
    } catch (error) {
      console.log(error);
    }
  }

  async arrayProducts(cid, products) {
    try {
      const product = products.map((product) => {
        return { product: product._id };
      });

      const result = await cartModel.updateOne(
        { _id: cid },
        {
          $push: {
            cart: { $each: product },
          },
        }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async updateQuantity(quantity, cid, pid) {
    try {
      const Cart = await cartModel.findById({
        _id: cid,
      });

      if (!Cart) {
        throw new NotFoundError("Carrito no encontrado");
      }

      const upgradeQuantity = await cartModel.updateOne(
        {
          "cart.product": pid,
        },
        {
          $inc: {
            "cart.$.quantity": quantity,
          },
        }
      );

      if (!upgradeQuantity) {
        throw new NotFoundError("Producto no encontrado ne le carrito");
      }

      return upgradeQuantity;
    } catch (error) {
      console.log(error);
    }
  }

  async emptyCart(cid) {
    try {
      const emptyCart = await cartModel.updateOne(
        {
          _id: cid,
        },
        {
          $set: {
            cart: [],
          },
        }
      );

      return emptyCart;
    } catch (error) {
      console.log(error);
    }
  }
}
