import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Types.ObjectId, ref: "carts" },
  role: { type: String, default: "user" },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(mongoosePaginate);
const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;
