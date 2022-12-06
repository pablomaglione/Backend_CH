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

app.get('/api/products/:id', async(req, res) => {
    try{
        const {id: paramID} = req.params;

        const id = Number(paramID)
        console.log(id)
        if(id < 0){
            return res.send({success: false, error: "ID incorrecto, deber ser un número válido"})
        }

        const product = await productManager.getProductByID(id);
        
        if (!product){
            return res.send({success: false, error: "Producto no encontrado"})
        }
        res.send({success: true, product});
    }catch(error){
        console.log(error);

        res.send ({success: false, error: "ERROR"})
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))