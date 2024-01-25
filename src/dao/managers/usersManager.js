import usersModel from "../models/usersModel.js";

export default class UsersManagerDB{
    
    getAll = async()=>{
        let users = await usersModel.find().lean(); //lean lo parsea en json para que nuestra vista pueda identificarlo.
        return users;
    }
    create = async(user)=>{
        let result = await usersModel.create(user);
        return result;
    }
    getBy = async(params)=>{
        let result = await usersModel.findOne(params).lean();
        return result;
    }
    updateUser = async(id, user)=>{
        delete user._id; //doble check, ver que es.
        let result = await usersModel.updateOne({_id:id},{$set: user})
    }
}