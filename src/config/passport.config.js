//autenticar
import passport from "passport";
//pasport strategys
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import userModel from "../dao/models/userModel.js";
import {createHash, validatePassword} from "../utils.js";

const localStrategy = local.Strategy;
const inicializePassport = ()=>{
    //estrategia
    //register
    passport.use("register", new localStrategy(
        //1
        {passReqToCallback: true, usernameField: "email"},
        //2
        async ( req, username, password, done ) =>{
            const {first_name, last_name, email, age} = req.body;
            try {
                let user = await userModel.findOne({email: username})
                if(user){
                    console.log("usuario ya registrado")
                    return done (null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser)
                return done (null,result)
            } catch (error) {
                return done (error)
            }
        }
    ));
    //login
    passport.use("login", new localStrategy(
    {usernameField:"email"},
    async(username, password, done)=>{
        try {
            const user = await userModel.findOne({email: username})
            if(!user){
                return done(null, false);
            }
            if(!validatePassword(password,user)){
                return done (null,false);
            } 
            return done (null, user)
        } catch (error) {
            return done (error)
        }
    }));
    //estrategia ingresar registrado por github
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.2e8231311a9a63c4",
        clientSecret: "11f7db37672bcf631a4c6fc81e898d9848b22c64",
        callBackUrl: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done)=>{
        try {
            console.log(profile);
            //las guardamos en variables por que no las toma sino, nose por q 
            const first_name = profile._json.name;
            const email = profile._json.email;
            if(!profile._json.name){
                email = profile.username;
            }
            let user = await userModel.findOne({email: profile._json.email})
            if(user){
                console.log("usuario ya registrado");
                return done (null, user);
            }
            const newUser = {
                first_name,
                last_name: " ",
                email,
                age: 18,
                password: " "
            }
            const result = await userModel.create(newUser)
            return done (null,result)
        } catch (error) {
            return done(error)
        }
    }))
    
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    });
    //
    passport.deserializeUser(async (id, done)=>{
        let user = await userModel.findById(id);
        done(null, user);
    });
}

export default inicializePassport;