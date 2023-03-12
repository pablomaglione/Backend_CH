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
const PORT = process.env.PORT;

MongoConnection.getInstance();
initializePassport()
// const MONGO_URL =
//   "mongodb+srv://user01:Us3r2023@ecommerce.yrj8xfb.mongodb.net/?retryWrites=true&w=majority";
// const PORT = 8080;
//const httpServer = new HttpServer(app);
//const io = new IOServer(httpServer);

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



//app.set("io", io);

// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: MONGO_URL,
//       dbName: "ecommerce",
//       collectionName: "sessions",
//       mongoOptions: {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//       ttl: 20,
//     }),
//     secret: "@Pablo",
//     resave: true,
//     saveUninitialized: true,
//   })
// );


app.use("/sessions", sessionRouter)
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/messages", messagesRouter);
app.use("/", ViewsRouter);


//Conexion a DB Mongo Atlas
// mongoose.set("strictQuery", false);
// mongoose.connect(MONGO_URL, { dbName: "ecommerce" }, (error) => {
//   if (error) {
//     console.error("No se pudo conectar a la DB");
//     return;
//   }

//   console.log("DB Connectado!!");
//httpServer.listen(PORT, () => console.log(`Server running`));
// });

app.listen(PORT, () => {
  console.log(`Server running`);
})