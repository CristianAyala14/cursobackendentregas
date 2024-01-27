import {Router} from "express";
import passport from "passport";
import { generateToken} from "../utils.js";
import UsersManagerDB from "../dao/managers/usersManager.js"
//importaciones para el logout
const usersManager = new UsersManagerDB();
import {createHash, validatePassword,} from "../utils.js";

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
router.get("/logout", (req, res) => {
    res.clearCookie("JwtCookie");
    res.redirect("/"); 
});

//reset password
router.post("/resetpassword", async(req,res)=>{
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