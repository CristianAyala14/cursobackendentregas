import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection = "products";
const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    code:{
        type: Number,
        require: true
    }, 
    price:{
        type: Number,
        require: true,
    },
    stock:{
        type: Number,
        require: true,
    },
    category:{
        type: String,
        require: true,
    }   

})

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, productsSchema);

export default productsModel;