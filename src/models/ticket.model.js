import mongoose, {Schema} from "mongoose";

const generateCode = () => {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let result = " ";

    const charLength = char.length;
    for (let i = 0; i < 10; i++){
        result += char.charAt(Math.floor(Math.random() * charLength))
    } 

    return result;
}

const ticketSchema = new Schema({
    id: Schema.Types.ObjectId,
    code:{
        type: String,
        default: generateCode(),
        unique: true,
    },
    amount: Number,
    purchaser: String,
})

ticketSchema.set("timestamps", {
    createdAt: "purchased_datetime"
})

const ticketModel = mongoose.model("Tickets", ticketSchema)

export default ticketModel;