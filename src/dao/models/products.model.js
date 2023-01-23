import mongoose from 'mongoose'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    thumbail: String,
    code: Number,
    stock: Number,
    category: String
})

const productModel = mongoose.model(productCollection, productSchema)

export default productModel;