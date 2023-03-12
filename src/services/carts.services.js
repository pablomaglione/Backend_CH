import cartModel from "../models/carts.model.js";
import userModel from "../models/user.model.js";
import ticketModel from "../models/ticket.model.js";
import ProductServices from "./products.services.js"

class CartsServices {
  createCart = async () => {
    try {
      const newCart = {
        products: [],
      };

      const result = await cartModel.create(newCart);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getCarts = async () => {
    try {
      const carts = await cartModel.find();

      if (carts) {
        return carts;
      } else {
        return {
          error: "No existen Carritos",
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCartByID = async (cid) => {
    try {
      const cart = await cartModel
        .findById({ _id: cid })
        .populate("product.id")
        .lean();

      if (cart) return cart;
      else
        return {
          error: "No existe Carrito con ese ID",
        };
    } catch (error) {
      console.log(error);
    }
  };

  addProductCart = async (cid, pid) => {
    try {
      const cart = await this.getCartByID(cid);
      if (!cart) throw new Error("Carrito no encontrado");

      const productInCart = await cartModel.findOne({ "product.id": pid });

      if (productInCart) {
        const upgQuatity = await cartModel.updateOne(
          { _id: cid },
          { $inc: { "product.quantity": 1 } }
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
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await this.getCartByID(cid);
      if (!cart) throw new Error("Carrito no encontrado");

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
  };

  arrayProducts = async (cid, products) => {
    try {
      const cart = await this.getCartByID(cid);
      if (!cart) throw new Error("Carrito no encontrado");

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
  };

  updateQuantity = async (quantity, cid, pid) => {
    try {
      const cart = await this.getCartByID(cid);
      if (!cart) throw new Error("Carrito no encontrado");

      const upgradeQuantity = await cartModel.updateOne(
        {
          "product.id": pid,
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
  };

  emptyCart = async (cid) => {
    try {
      const cart = await this.getCartByID(cid);
      if (!cart) throw new Error("Carrito no encontrado");

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
  };

  generateTicket = async (purchase, total) => {
    try{
      const result = await ticketModel.create({
        amout: total,
        purchase: purchase,
      })

      return result;
    }catch(error){
      console.log(error);
    }
  }

  deleteProductStock = async (cid, products) => {
    try{
      let total = 0;

      products.forEach(async(product) => {
        const pid = product.product_id;

        if(ProductServices.updateStock(pid, product.quantity)){
          await this.deleteProductFromCart(cid, pid)

          total += product.product.price
        }
        
      });
      return total;
    }catch(error){
      console.log(error);
    }
  }

  purchaseProducts = async (cid) => {
    try{
      const cart = await this.getCartByID(cid)

      if(!cart) throw new Error ("Carrito no exite")

      const products = Array.from(products.cart)

      const purchase = await userModel.findOne({cart: cid}).lean().exec()

      const total = await this.deleteProductFromCart(cid, products)

      const ticket = await this.generateTicket(purchase.email, total)

      return ticket;
    }catch(error){
      console.log(error);
    }
  }
}


const CartServices = new CartsServices();

export default CartServices