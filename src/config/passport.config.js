//pasport and passport strategys
import passport from "passport";
import local from "passport-local";
//hash
import {createHash, validatePassword} from "../utils.js";
//managers
import {UsersManagerDB} from "../dao/managers/usersManager.js"

const usersManager = new UsersManagerDB();


const localStrategy = local.Strategy;
const inicializePassport = ()=>{
    //estrategia
    //register
    passport.use("register", new localStrategy(
        //1
        {passReqToCallback: true, usernameField: "email",session: false},
        //2
        async ( req, email, password, done ) =>{
            try {
                const {first_name, last_name, age, role} = req.body;
                if(!first_name || !last_name || !age || !role){
                    return done(null, false,{message:"Valores incompletos."})
                }
                let exists = await userModel.findOne({email: email})
                if(exists){
                    return done (null, false, {message:"Usuario ya registrado."})
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role
                }
                let result = await usersManager.create(newUser)
                return done (null,result)
            } catch (error) {
                return done (error)
            }
        }
    ));
    //login
    passport.use("login", new localStrategy(
    {passReqToCallback:true, usernameField:"email",session:false},
    async(email, password, done)=>{
        try {
            const user = await usersManager.getBy({email: email})
            if(!user){
                return done(null, false);
            }
            if(!validatePassword(password,user)){
                return done(null, false,{message:"Credenciales incorrectas."})            
            } 
            return done (null, user)
        } catch (error) {
            return done (error)
        }
    }));
    
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    });
    //configs finales de passportlocal
    passport.deserializeUser(async (id, done)=>{
        let result = await usersManager.getBy(id);
        return done(null,result)
    });
}

export default inicializePassport;