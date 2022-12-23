import express from 'express';
import __dirname from './dirname.js';
import handlebars from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io"
import { ViewsRouter, cartsRouter, productsRouter } from './routers/index.router.js';
import { productManager } from './Managers/index.js';

const app = express();
const PORT = 8080;
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.engine("handlebars", handlebars.engine({
    extname: ".handlebars",
    defaultLayout: "main.handlebars",
}));

app.use(express.static("public"));

app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("io", io);
app.use('/', ViewsRouter)

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on('connection', async (socket) => { console.log(`New client connected, id: ${socket.id}`);

    const products = await productManager.getProducts();

    io.sockets.emit("products", products);

    socket.on("addProduct", async (product) => {
        console.log(product)
        await productManager.addProduct(product);
    })
});

