class ProductManager {

    constructor () {
        this.products = []
    }

    addProduct = (title, description, price, thumbail, code, stock) => {
        const product = {
            id: this.getProductID(),
            title,
            description,
            price,
            thumbail,
            code,
            stock,
        }
        const codeDuplicated = (prod) => (prod.code == product.code); //Busca si el code ya existe, si no existe carga el producto

        if (!this.products.some(codeDuplicated)){
            this.products.push(product)
        } else {
            console.log("Codigo duplicado")
        }
    }

    getProducts = () => {
        if(this.products.length > 0)
            return this.products
        else
            return 0
    }

    //23-11 Modificar para buscar el ultimo ID y sumarle 1
    getProductID = () => {
        return (this.products.length + 1)
    }

    getProductByID = (productid) => {
        const prod = this.products.find(p => p.id == productid)
        
        if(prod){
            console.log(prod)}
        else{
            console.log("Not Found")}
    }
}


//TEST
const product = new ProductManager()

console.log("Products: ", product.getProducts()) // Imprime todos los productos cargados o 0 sin no hay ninguno


product.addProduct("titulo", "descrip", 100, "foto", 5, 10)
product.addProduct("titulo2", "descrip2", 200, "foto", 6, 11)
product.addProduct("titulo3", "descrip2", 200, "foto", 1, 11)

console.log("Products: ", product.getProducts()) //Imprime todos los productos cargados

product.getProductByID(5) // ID no exite
product.getProductByID(2) // Imprime el producto con ID 2



