import {Router} from "express";
import passport from "passport";
import { generateToken} from "../utils.js";
import UsersManagerDB from "../dao/managers/usersManager.js";
//importaciones para el logout
const usersManager = new UsersManagerDB();
//para crear carrito en el login
import CartManager from "../dao/managers/cartManagerDB.js";
const cartManager = new CartManager();
//logout
import { passportCall } from "../utils.js";
import {createHash} from "../utils.js";

const router = Router();
//register con autenticacion passport local: 
router.post("/register", passport.authenticate("register", {passReqToCallback: true,session: false, failureRedirect:"/api/sessions/failregister",failureMessage: true}), async(req,res)=>{
    res.send({
        status: "success",
        message: "Usuario registrado",
        payload: req.user._id
    })

})
router.get("/failregister", async(req,res)=>{
    res.send({error: "Fallo en el registro"})
})
//login con autenticacion  passport local::
router.post("/login", passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    //preguntamos si es user o si es admin. si es user se crea el carrito
    let userCartId = null;
    if (req.user.role === "user" && !req.user.cartId) {
        // le creamos un carrito cuando se registra.
        userCartId = await cartManager.createCart();
        // Actualizamos la base de datos con el cartId
        await cartManager.addCartToUser(req.user._id, userCartId);
    }
    // user para token
    const user = {
        id: req.user._id,
        name: req.user.first_name,
        role: req.user.role,
        email: req.user.email,
        userCart: userCartId
    };
    // creo token
    const access_token = generateToken(user);
    // guardo en cookie y response
    res.cookie("JwtCookie", access_token, { httpOnly: true, maxAge: 360000 }).send({
        status: "success",
        message: "Usuario logeado",
        payload: user
    });
});
router.get("/faillogin", (req,res)=>{
    res.send({error: "Fallo en el log in"})
})
//log out
router.get("/logout", passportCall("jwt"), async (req, res) => {
    console.log(req.user)
    //cuando se deslogea, se elimina el carrito.(preguntar si el carrito esta vacio, por q si no esta vacio lo vamos a tener que guardar en localstorage)
    let userCartId= req.user.userCart;
    await cartManager.deleteCartById(userCartId);
    //tmb elimino el carrito asociado al usuario
    await cartManager.removeCartFromUser(req.user.id)
    res.clearCookie("JwtCookie");
    res.redirect("/"); 
});

//reset password
router.post("/resetpassword",async(req,res)=>{
    const {email, password} = req.body;
    try {
        if(!email || !password){
            res.status(400).json({ error: "Internal Server Error" });
        }
        let user = await usersManager.getBy({email: email})
        if(user){
            let id = user._id;
            user.password = createHash(password)
            let result = await usersManager.updateUser(id, user)
            const userToken ={
                id: user._id,
                name:  user.first_name,
                role: user.role,
                email: user.email
            }
            generateToken(userToken);
            res.send({status: "success", message: "contraseña modificada.", result})

        }
        
    } catch (error) {
        res.status(400).json({ error: "Internal Server Error" });
    }









})

export default router;