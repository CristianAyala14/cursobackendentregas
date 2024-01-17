import {Router} from "express";
import { CartManagerDB } from "../dao/managers/cartManagerDB.js";
let cartManager = new CartManagerDB();
const router = Router();

//autorizaciones segun usuario.
const publicAccess = (req,res,next)=>{
    if(req.session.user){
        return res.redirect("/")
    }
    next();
}
const privateAccess = (req,res,next)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    next();
}


//views routes para sessions
router.get("/profile", privateAccess, (req,res)=>{
    res.render("profile",{user: req.session.user})
})
router.get("/register", publicAccess, (req,res)=>{
    res.render("register")
})
router.get("/login", publicAccess, (req,res)=>{
    res.render("login")
})
router.get("/resetpassword", publicAccess, (req,res)=>{
    res.render("resetPassword")
})




//
router.get("/registerproduct", privateAccess, (req,res)=>{
    res.render("registerProducts")
})

//vista de productos cargados
router.get("/search", privateAccess, async(req,res)=>{
    res.render("searchProducts" )
})
//vista buscar producto por id
router.get("/cartDetail/:cid", privateAccess, async (req, res) => {
    try {
        const cid  = req.params.cid;
        let rta = await cartManager.getCartById(cid)
        let id = rta[0]._id
        console.log(id)
        res.render("cartDetails", {id} )
    } catch (error) {
        console.log("error")
    }
});



export default router;