import cartsModel from "../models/cartsModel.js";
import productsModel from "../models/productsModel.js";
import usersModel from "../models/usersModel.js"
class CartManagerDB{
    //tested
    createCart = async () => {
        try {
            const newCart = await cartsModel.create({ products: [] });
            return newCart._id;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    };
    getCarts = async() => {
        try {
            const carts = await cartsModel.find();
            return carts;
        } catch (error) {
            throw new Error(`Error al obtener productos del carrito: ${error.message}`);
        }
    };
    getCartById = async (cid) => {
        try {
            const cart = await cartsModel.find({_id: cid})
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    };
   
    addProductInCart = async (cid, pid, quantity = 1) => {
        try {
            //verificamos que carrito y producto existan.
            const cart = await cartsModel.findOne({_id: cid})
            if(!cart){
                return{
                    status: error,
                    message: `El carrito con el id ${cid} no existe.`
                }
            };
            //usamos productsModel para verificar que el producto exista
            const product = await productsModel.findOne({_id: pid})
            if(!product){
                return{
                    status: error,
                    message: `El carrito con el id ${pid} no existe.`
                }
            };
            let productsIncart = cart.products;
            const indexProduct = productsIncart.findIndex((el)=>el.product == pid);
            if(indexProduct==-1){
                const newProduct = {
                    product: pid,
                    quantity
                }
                cart.products.push(newProduct);
            }else{
                cart.products[indexProduct].quantity +=quantity;
            }
            await cart.save(); // ???
            return{
                status: "succes",
                message: "El producto se agrego correctamente."
            }
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito`);
        }
    };
    removeProductFromCart = async (cid, pid) => {
        try {
            //existe carrito?
            const cart = await cartsModel.findOne({_id: cid});
            if (!cart) {
                return {
                    status: "error",
                    message: `El carrito con el ID ${cid} no existe.`
                };
            }
            //existe producto?
            const productIndex = cart.products.findIndex((el) => el.product === pid);
            if (!productIndex) {
                return {
                    status: "error",
                    message: `El producto con el ID ${pid} no está en el carrito.`
                };
            }            
            // Eliminar el producto del array de productos en el carrito
            cart.products.splice(productIndex, 1);
            await cart.save();
            return {
                status: "success",
                message: "Producto eliminado correctamente del carrito."
            };
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    };
    removeAllProductsFromCart = async (cid) => {
        try {
            //Existe carrito?
            const cart = await cartsModel.findOne({_id: cid});
            if (!cart) {
                return {
                    status: "error",
                    message: `El carrito con el ID ${cid} no existe.`
                };
            }
            cart.products = [];
            await cart.save();
            return {
                status: "success",
                message: "Todos los productos fueron eliminados del carrito correctamente."
            };

        } catch (error) {
            throw new Error(`Error al eliminar todos los productos del carrito: ${error.message}`);
        }
    };
    updateCartProducts = async (cid, newProducts) => {
        try {
            // Existe carrito?
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                return {
                    status: "error",
                    message: `El carrito con el ID ${cid} no existe.`
                };
            }
            // Verifico que cada producto en el array exista
            newProducts.forEach(async (el) => {
                const productExist = await productsModel.findById(el._id); //en caso de que cuando le pasamos a esta funcion los productos, venga con un _id. 
                if (!productExist) {
                    return {
                        status: "error",
                        message: `El producto con el ID ${el._id} no existe.`
                    };
                }
            })
            // Actualizamos la lista de productos del carrito
            cart.products = newProducts;
            await cart.save();
            return {
                status: "success",
                message: "Productos del carrito actualizados correctamente."
            };
        } catch (error) {
            throw new Error(`Error al actualizar los productos del carrito: ${error.message}`);
        }
    };
    updateProductQuantity = async (cid, pid, quantity) => {
        try {
            //Existe carrito?
            const cart = await cartsModel.findOne({_id: cid});
            if (!cart) {
                return {
                    status: "error",
                    message: `El carrito con el ID ${cid} no existe.`
                };
            }
            //Existe producto?
            const productIndex = cart.products.findIndex(el => el.product === pid);
            if (productIndex === -1) {
                return {
                    status: "error",
                    message: `El producto con el ID ${pid} no existe en el carrito.`
                };
            }
            cart.products[productIndex].quantity = quantity;
            await cart.save();

            return {
                status: "success",
                message: "Cantidad de producto actualizada correctamente."
            };

        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
        }
    };


    //experimento para cunado logeo y deslogeo, q se cree carrito y se agregue al usuario y visebersa
    deleteCartById = async (cartId) => {
        try {
            const result = await cartsModel.findByIdAndDelete(cartId);
            if (!result) {
                return {
                    status: "error",
                    message: `El carrito con el ID ${cartId} no fue encontrado.`
                };
            }
            return {
                status: "success",
                message: result
            };
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    };

    addCartToUser = async (userId, cid) => {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId,{ $set:{ cartId: cid }});
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al agregar el ID del carrito al usuario: ${error.message}`);
        }
    };

    removeCartFromUser = async (userId) => {
        try {
            const user = await usersModel.findOne({ _id: userId });
            if (user && user.cartId) {
                await usersModel.findByIdAndUpdate(userId, { $unset: { cartId: 1 } });
            } 
        } catch (error) {
            throw new Error(`Error al eliminar el carrito y actualizar el usuario: ${error.message}`);
        }
    };
}

export default  CartManagerDB;