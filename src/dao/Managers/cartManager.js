import fs from "fs";
import { productManager } from '../Managers/index.js';

export class CartManager {

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

    async getProductsCart() {
        try {
            const resp = await fs.promises.readFile(this.path, "UTF-8");

            return JSON.parse(resp)
        } catch (error) {
            console.log(error)
        }
    }

    async addProductCart(cid, pid) {
        
        const productsCart = await this.getProductsCart();
        
        const selCart = productsCart.find((cart) => (cart.id == cid));
        
        if (!selCart) {
            return {
                error: "Carrito no encontrado"
            }
        }

        const selProduct = await productManager.getProductByID(pid);

        if (!selProduct) {
            return {
                error: "Producto no encontrado"
            }
        }
        
        const productExist = selCart.products.some((prod) => prod.id === pid)

        if (productExist) {
            const addCountProduct = selCart.products.find((prod) => prod.id === selProduct.id);

            addCountProduct.quantity++;

            await fs.promises.writeFile(this.path, JSON.stringify(productsCart, null, 3));

            return selCart;
        }else {
            selCart.products.push({
                id: selProduct.id,
                quantity: 1,
            })
        }
    
        await fs.promises.writeFile(this.path, JSON.stringify(productsCart, null, 3));

        return selCart;
    }

    async createCart() {
        try {
            const carts = await this.getProductsCart();
            let id;
            if (!carts.length)
                id = carts.length + 1;
            else
                id = carts[carts.length - 1].id + 1;

            const newCart = {
                id,
                products: [],
            }

            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 3));

            return newCart;

        } catch (error) {
            console.log(error)
        }
    }

    async getCartByID(productid) {
        const products = await this.getProductsCart();
        const prod = products.find(p => p.id === productid)

        if (prod)
            return prod;
        else
            return {
                error: "No existe Carrito con ese ID"
            }
    }
}