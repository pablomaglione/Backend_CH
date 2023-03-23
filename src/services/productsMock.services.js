import { generateProducts } from '../utils/products.mock.js'

export const saveGenerateProducts = () => {
    const quantity = 100;
    let products = [];

    for (let i=0; i < quantity; i++){
        products.push(generateProducts());
    }
    return{
        status: 200,
        response: products,
    }
}