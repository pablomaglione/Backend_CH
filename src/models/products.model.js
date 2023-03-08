import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    thumbail: String,
    code: Number,
    stock: {
        type: Number,
        index: true,
    },
    category: {
        Type: String,
        index: true,
    },
})

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;