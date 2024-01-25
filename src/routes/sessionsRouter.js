import {Router} from "express";
import passport from "passport";
import { generateToken, passportCall , authorizeRole} from "../utils.js";


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
router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "/api/sessions/faillogin"}), 
async(req,res)=>{
    //user para token
    const user ={
        id: req.user._id,
        name:  req.user.first_name,
        role: req.user.role,
        email: req.user.email
    }
    //creo token
    const access_token = generateToken(user);
    //guardo en cookie y response
    res.cookie("JwtCookie", access_token, {httpOnly: true,maxAge: 360000}).send({
        status: "success",
        message: "Usuario logeado",
        payload: user
    })

})
router.get("/faillogin", (req,res)=>{
    res.send({error: "Fallo en el log in"})
})











//log out
router.get("/logout", async(req,res)=>{
    

})

//reset password
router.post("/restartPassword", async(req,res)=>{

})

export default router;