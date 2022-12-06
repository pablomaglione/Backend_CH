//const fs = require("fs");
import fs from "fs";

export class ProductManager {

    constructor (path) {
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

    async addProduct ({title, description, price, thumbail, code, stock}){
        if (!title || !description || !price || !thumbail || !code || !stock){
            return { error: "Completar todos los campos, son obligatorios" };
        }
        const newProduct = {
            id: await this.getProductID(),
            title,
            description,
            price,
            thumbail,
            code,
            stock,
        }
        const products = await this.getProducts();
    
        const codeDuplicated = (prod) => (prod.code == newProduct.code); //Busca si el code ya existe, si no existe carga el producto
        
        if (!products.some(codeDuplicated)){
            products.id = this.getProductID();

            products.push(newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));

            return newProduct;

        } else {
            return{ error: "Codigo Duplicado" };
        }
    }

    async getProducts() {
        try{
            const resp = await fs.promises.readFile(this.path, "UTF-8");
            
            return JSON.parse(resp)        
        }catch (error){
            console.log(error)
        }
    }

    async getProductID (){
        try{
            const products = await this.getProducts();
            let ID;
            if(!products.length)
                ID = products.length + 1;
            else
                ID = products[products.length - 1].id + 1;
            return (ID)
        }catch (error){
            console.log(error)
        }
    }

    async getProductByID (productid) {
        const products = await this.getProducts();
        const prod = products.find(p => p.id === productid)

        if(prod)
            return prod;
        else
            return {error: "No existe producto con ese ID"}
    }

    async updateProduct(productid, updProd){
        try{
            let products = await this.getProducts();
            const prod = products.findIndex(p => p.id == productid)

            products[prod] = {...products[prod], ...updProd}
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));
            
            return products
        }catch(error){
            console.log(error)}
    }   

    async deleteProduct(productid){
        try{
            let products = await this.getProducts();
            const prod = products.filter(p => p.id != productid)
            
            await fs.promises.writeFile(this.path, JSON.stringify(prod, null, 3));
            
            return prod
        }catch(error){
            console.log(error)}
    }
}

//TEST
/*
const products = new ProductManager('./ProductManager.json')
const test = async () => {

    //Carga de productos
    const prod = await products.addProduct({
        title:"titulo", 
        description:"descrip", 
        price: 100,
        thumbail: "foto", 
        code: 5, 
        stock: 10});

    const prod1 = await products.addProduct({
        title:"titulo1", 
        description:"descrip", 
        price: 100,
        thumbail: "foto", 
        code: 6, 
        stock: 10});
    
    const prod2 = await products.addProduct({
        title:"titulo3", 
        description:"descrip3", 
        price: 1050,
        thumbail: "foto6", 
        code: 9, 
        stock: 10});
 
    //console.log(await products.getProducts()); // Imprime todos los productos cargados o [] sin no hay ninguno
    //console.log(await products.getProductByID(1)); // Imprime el producto del ID pasado
    
    // ====== Producto a modificar, se pasa el ID del mismo y los datos nuevos
    
    /*const updProd = await products.updateProduct(2, {
        title:"tituloNew", 
        description:"descripX", 
        thumbail: "fotoNueva", 
        stock: 10});
        */
    //console.log(await products.getProducts()) // Imprime todos los productos cargados y modificados o [] sin no hay ninguno
    //console.log(await products.deleteProduct(2)) // Elimina el producto con ID pasado e imprime los productos
/*}

test();
*/


