import mongoose from "mongoose";

const collection = "cart";
const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: String
            },
            quantity: {
                type: Number,
                require: true,
                default: 1
            }
        }
    ]
});

cartsSchema.pre("find", function(){
    this.populate("products.product")
})

const cartsModel = mongoose.model(collection, cartsSchema);

export default cartsModel;