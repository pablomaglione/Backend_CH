import express from 'express';
import {productManager} from './Managers/index.js'

const app = express();

const PORT = 8080;

app.get('/api/products', async (req, res) => {
    try {
        const {limit} = req.query

        const allProducts = await productManager.getProducts();

        if (!limit || limit < 1) {
            return res.send({success: true, products: allProducts});
        }

        const products = allProducts.slice(0, limit);

        res.send({success: true, products});
    } catch (error) {
        console.log(error);
        res.send({ success: false, error: "Ha ocurrido un error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))