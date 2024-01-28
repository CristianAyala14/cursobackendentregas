import CartManagerDB from "../dao/managers/cartManagerDB.js";
import  {Router} from "express";
import { passportCall } from "../utils.js";

const router = Router();
const cartManager = new CartManagerDB();

//show carts (nose donde usaria esto)
router.get("/", async (req,res)=>{
    tr
    const carts = await cartManager.getCarts();
    res.send({
        status: "success",
        message: carts
    })
})
//create cart
router.post("/create", async (req,res)=>{
    try {

        let cart = await cartManager.createCart(newCart);
        res.send({
            status: "success",
            message: cart
        })   
    } catch (error) {
        console.error('Error:', error);
    }
})
//get cart by id
router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.json({
            status: "success",
            message: cart
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: `Error al obtener detalles del carrito: ${error.message}`
        });
    }
});
//Add product to cart
router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const cart = await cartManager.addProductInCart(pid, cid, quantity)
        res.status(200).json({
            status: "success",
            message: cart
        })
});
// Remove all products from id cart
router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await cartManager.removeAllProductsFromCart(cid);
    res.send({
        status: "success",
        message: result
    });
});
// remove a product id from id cart
router.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartManager.removeProductFromCart(pid, cid);
    res.send({
        status: "success",
        message: result
    });
});
// update product quantity in a cart
router.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.send({
        status: "success",
        message: result
    });
});
// update cart with products array 
router.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const newProducts = req.body.products; //  req.body.products debe ser un array de productos con un id.
    const result = await cartManager.updateCartProducts(cid, newProducts);
    res.send({
        status: "success",
        message: result
    });
});

//ruta de prueba para ver si puedo acceder al carrito del usuario desde el front end
router.get("/currentcart", passportCall("jwt"), (req,res)=>{
        const currentCart = req.user.cartId
        
    })



    //cookie stractor para estrategia jwt en passport.
  

export default router; 