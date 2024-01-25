import {Router} from "express";
import { CartManagerDB } from "../dao/managers/cartManagerDB.js";
let cartManager = new CartManagerDB();
const router = Router();

//POLITICAS autorizaciones segun usuario.
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


//SESSIONS
router.get("/register", publicAccess, (req,res)=>{
    res.render("registerUser")
})
    //profile user
router.get("/profile", privateAccess, (req,res)=>{
    res.render("profile")
})
    //register user
    //login user
router.get("/login", publicAccess, (req,res)=>{
    res.render("login")
})
    //reset user password
router.get("/resetpassword", publicAccess, (req,res)=>{
    res.render("resetPassword")
})


//register product view
router.get("/registerproduct", privateAccess, (req,res)=>{
    res.render("registerProducts")
})
//added products view
router.get("/search", privateAccess, async(req,res)=>{
    res.render("searchProducts" )
})
//get cart product by ids view
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