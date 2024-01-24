import mongoose from "mongoose";
const collection = "users"
const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    //referencia a carts
    cartId:{
        type:[
            {
                type:mongoose.SchemaTypes.ObjectId,
                ref: "Cart"
            }
        ],
        default: []
    },
    role:{
        type: String,
        enum:["user", "Admin"],
        default: "user"
    },
})

const userModel = mongoose.model(collection, usersSchema)
export default userModel;