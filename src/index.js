import express from "express";
import __dirname from "./dirname.js";
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
import { productDBManager } from "./dao/Managers/index.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
const MONGO_URL =
  "mongodb+srv://user01:Us3r2023@ecommerce.yrj8xfb.mongodb.net/?retryWrites=true&w=majority";
const PORT = 8080;
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.engine(
  "handlebars",
  handlebars.engine({
    extname: ".handlebars",
    defaultLayout: "main.handlebars",
  })
);

app.use(express.static("public"));

app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("io", io);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      dbName: "ecommerce",
      collectionName: "sessions",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 20,
    }),
    secret: "@Pablo",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const Auth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  return res.status(400).send("No autorizado");
};

app.use("/sessions", sessionRouter)
app.use("/api/products/", Auth, productsRouter);
app.use("/api/carts/", Auth, cartsRouter);
app.use("/messages", Auth, messagesRouter);
app.use("/", ViewsRouter);


//Conexion a DB Mongo Atlas
mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL, { dbName: "ecommerce" }, (error) => {
  if (error) {
    console.error("No se pudo conectar a la DB");
    return;
  }

  console.log("DB Connectado!!");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

io.on("connection", async (socket) => {
  console.log(`New client connected, id: ${socket.id}`);

  const products = await productDBManager.getProducts();

  io.sockets.emit("products", products);

  socket.on("addProduct", async (product) => {
    console.log(product);
    await productDBManager.addProduct(product);
  });
});
