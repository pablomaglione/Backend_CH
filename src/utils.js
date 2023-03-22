import bcrypt from "bcrypt";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";


dotenv.config();
console.log(process.env);
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const MongoStoreSession = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB,
    collectionName: process.env.COLLECTION_NAME,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 20,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
};