import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        title: String,
        quantity: Number,
      },
    ],
    defualt: [],
  },
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
