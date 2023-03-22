import express from "express";
import __dirname from "./dirname.js";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import {
  ViewsRouter,
  cartsRouter,
  productsRouter,
  messagesRouter,
  sessionRouter
} from "./routers/index.router.js";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { MongoConnection } from "./mongo.js";
import { MongoStoreSession } from "./utils.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT

MongoConnection.getInstance();
initializePassport()

app.engine(
  "handlebars",
  handlebars.engine({
    extname: ".handlebars",
    defaultLayout: "main.handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(session(MongoStoreSession))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static( __dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/sessions", sessionRouter)
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/messages", messagesRouter);
app.use("/", ViewsRouter);

app.listen(PORT, () => {
  console.log(`Server running`);
})