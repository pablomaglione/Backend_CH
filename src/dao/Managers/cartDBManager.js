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

  async getCarts (){
    const carts = await cartModel.find()

    if(carts)
    {return carts;}
    else{
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
}
