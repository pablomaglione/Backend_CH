import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const sessionCollection = 'sessions'

const sessionSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String
})

sessionSchema.plugin(mongoosePaginate)
const sessionModel = mongoose.model(sessionCollection, sessionSchema)

export default sessionModel;