import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//recursos para passport strategy
//bcrypt (funcion que evuelve hasheada la password)
export const createHash = (password) =>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
};
    //valida la contraseña
export const validatePassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}


const PRIVATE_KEY = "EcommerceKeyUser";
export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1d" });
    return token;
};
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (token === "null") {
        return res.status(401).send({ status: "error", error: "No autorizado" });
    }
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        console.log(error);
        if (error) {
            return res.status(401).send({ status: "error", error: "No autorizado" });
        }
        req.user = credentials.user;
        next();
    });
};


