import mongoose from "mongoose";

const collection = "carts";
const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "products"
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