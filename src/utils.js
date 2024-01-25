import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//recursos para passport local strategy
//bcrypt (funcion que evuelve hasheada la password)
export const createHash = (password) =>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
};
    //valida la contraseña
export const validatePassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}



//funciones para generar token
    //genera el token
export const generateToken = (user) => {
    let token = jwt.sign(user, "EcommerceKeyUser", { expiresIn: "1d" });
    return token;
};



//middleware custom call para passport jwt. (de esta manera podemos ver por que no estaria autorizado de ser el caso, ya que si dejo solo "passport.authenticate("jwt",).. "" obtendre un unauthorized sin mas)
export const passportCall = (strategy)=>{
    return async (req, res, next)=>{
        passport.authenticate(strategy, {session: false}, function(err,user,info){
            if(err){
                return next(err); 
            } 
            if(!user){
                return res.status(401).json({status: "error aqui", error: info.toString()})
            }
            req.user = user;
            next()
        })(req,res,next) 
    }
}


//middelware de autorizacion para comprobar el rol 
export const authorizeRole = (role)=>{
    return async(req,res,next)=>{
        if(!req.user){
            return res.status(401).json({error: "Usuario no autorizado"})
        }
        if(req.user.role !== role){
            return res.status(403).json({error: "Usuario sin permiso"})
        }
        

        next();
    }
}

