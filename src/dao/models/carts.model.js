import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  product: [{ id: Number, quantity: Number }],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
