//const fs = require("fs");
import fs from "fs";

export class ProductManager {

    constructor(path) {
        this.path = path;
        this.init();
    }

    init() {
        try {
            const existFile = fs.existsSync(this.path);
            if (existFile) return;

            // Si no existe, ya lo inicializamos con un array vacio
            fs.writeFileSync(this.path, JSON.stringify([]));
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct({
        title,
        description,
        price,
        thumbail,
        code,
        status,
        stock,
        category
    }) {
        if (!title || !description || !price || !code || !status || !stock || !category) {
            return {
                error: "Completar todos los campos, son obligatorios"
            };
        }
        const newProduct = {
            id: await this.getProductID(),
            title,
            description,
            price,
            thumbail,
            code,
            status,
            stock,
            category,
        }
        const products = await this.getProducts();

        const codeDuplicated = (prod) => (prod.code == newProduct.code); //Busca si el code ya existe, si no existe carga el producto

        if (!products.some(codeDuplicated)) {
            products.id = this.getProductID();

            products.push(newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));

            return newProduct;

        } else {
            return {
                error: "Codigo Duplicado"
            };
        }
    }

    async getProducts() {
        try {
            const resp = await fs.promises.readFile(this.path, "UTF-8");

            return JSON.parse(resp)
        } catch (error) {
            console.log(error)
        }
    }

    async getProductID() {
        try {
            const products = await this.getProducts();
            let ID;
            if (!products.length)
                ID = products.length + 1;
            else
                ID = products[products.length - 1].id + 1;
            return (ID)
        } catch (error) {
            console.log(error)
        }
    }

    async getProductByID(productid) {
        const products = await this.getProducts();
        const prod = products.find(p => p.id === productid)

        if (prod)
            return prod;
    }

    async updateProduct(productid, updProd) {
        try {
            let products = await this.getProducts();
            const prod = products.findIndex(p => p.id == productid)

            products[prod] = {
                ...products[prod],
                ...updProd
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));

            return products
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(productid) {
        try {
            let products = await this.getProducts();
            const prod = products.filter(p => p.id != productid)

            await fs.promises.writeFile(this.path, JSON.stringify(prod, null, 3));

            return prod
        } catch (error) {
            console.log(error)
        }
    }
}