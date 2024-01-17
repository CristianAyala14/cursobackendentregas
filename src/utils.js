import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//bcrypt (funcion que evuelve hasheada la password)
export const createHash = (password) =>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
};
    //valida la contraseña
export const validatePassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}

export default __dirname;
