import { CartManagerDB } from "../dao/managers/cartManagerDB.js";
import  {Router} from "express";

const router = Router();
const cartManager = new CartManagerDB();

router.get("/", async (req,res)=>{
    tr
    const carts = await cartManager.getCarts();
    res.send({
        status: "success",
        message: carts
    })
})
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
//crear carrito
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
//Agrega un producto al carrito
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
// Elimina todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await cartManager.removeAllProductsFromCart(cid);
    res.send({
        status: "success",
        message: result
    });
});
// Elimina un producto específico del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartManager.removeProductFromCart(pid, cid);
    res.send({
        status: "success",
        message: result
    });
});
// Actualiza el carrito con un arreglo de productos ?? 
router.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const newProducts = req.body.products; //  req.body.products debe ser un array de productos con un id.
    const result = await cartManager.updateCartProducts(cid, newProducts);
    res.send({
        status: "success",
        message: result
    });
});
// Actualiza la cantidad de un producto en el carrito
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







export default router; 