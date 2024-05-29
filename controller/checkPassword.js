import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';

async function checkPassword(request, response){
   
    try{
        
const { password , usersId} = request.body

const user = await userModel.findById(usersId)
const verifyPass = await bcryptjs.compare(password,user.password)
if(!verifyPass){
    return response.status(400).json({
        message : "Wrong user name or password",
        error : true
    })
}
const tokenData = {
    id : user._id,
    email : user.email
}
const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

const cookieOption = {
    http : true,
    success : true
}
return response.cookie('token',token,cookieOption).status(200).json({
    message : "Login Succuess",
    token : token,
    success : true
})

    }catch(error){  
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}
export default checkPassword;