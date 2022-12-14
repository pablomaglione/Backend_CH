import express from 'express';
import productRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products/', productRouter);
app.use('/api/carts/', cartsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))