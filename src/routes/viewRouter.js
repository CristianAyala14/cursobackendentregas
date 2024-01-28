import {Router} from "express";
import CartManagerDB  from "../dao/managers/cartManagerDB.js";
let cartManager = new CartManagerDB();
import { passportCall , authorizeRole} from "../utils.js";

const router = Router();

//Home
router.get("/",(req,res)=>{
    
    res.render("home")
})

//SESSIONS
    //register user
router.get("/registeruser",(req,res)=>{
    
    res.render("registerUser")
})
    //profile user
router.get("/profile", passportCall("jwt"),(req,res)=>{
    let user = {}
    if(req.user){
        user= req.user
        if(user.role === "admin"){
            user = {...req.user, isAdmin: true}
        }
        res.render("profile", {user});
    }else{
        return res.redirect("/profile");

    }
})

    //login user
router.get("/login",(req,res)=>{
    if (req.cookies["JwtCookie"]) {
        return res.redirect("/profile");
    }else{
        res.render("login");
    }
})
    //reset user password
router.get("/resetpassword", (req,res)=>{
    res.render("resetPassword")
})





//PRODUCTS
    //register product view
router.get("/registerproducts", passportCall("jwt"), authorizeRole("admin"), async (req,res)=>{
    res.render("registerProducts")
})
    //added products view
router.get("/searchproducts", passportCall("jwt"), async(req,res)=>{
    res.render("searchProducts" )
})
    //get cart product by ids view
router.get("/cartDetail/:cid",passportCall("jwt"), authorizeRole("admin"), async (req, res) => {
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