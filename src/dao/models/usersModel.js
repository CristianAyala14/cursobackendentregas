import mongoose from "mongoose";
const collection = "users"
const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cartId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref: "carts"
    },
    role:{
        type: String,
        enum:["user", "admin"],
        default: "user"
    }
})

const userModel = mongoose.model(collection, usersSchema)
export default userModel;