import productsModel from "../models/productsModel.js";
class ProductManagerDB{
    getProducts = async(filter, options)=>{
        try {
            const products = await productsModel.paginate(
                filter,
                options
            );
            return products;
        } catch (error) {
            return "Error en la ejecucion.";
        }
    }
    getProductById= async(pId)=>{
        try {
                const product = await productsModel.findOne({_id: pId})
                return {
                    status: "success",
                    message: product
                }   
        } catch (error) {
            return "Error en la ejecucion.";
        }
        
    }
    createProducts = async(product)=>{
        try {
            await productsModel.create(product);
            return{
                status: "success",
                message: "El producto se agrego correctamente."
            }

        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }
    deleteProduct = async (pId) => {
        try {
            await productsModel.deleteOne({_id: pId});
            return{
                status: "success",
                message: "El producto se agrego correctamente."
            }

        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }
}

export {ProductManagerDB};

