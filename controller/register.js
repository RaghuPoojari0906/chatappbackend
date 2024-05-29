import userModel from "../models/userModel.js";
import bcryptjs from 'bcryptjs';

async function registerUser(request,response){
    try{
        const { name, email, password, profile } =request.body
        const  checkEmail = await userModel.findOne({email})
        
        if(checkEmail){
            return response.status(400).json({
                message : "Email already exists",
                error : true,
            })
        }

const salt = await bcryptjs.genSalt(10)
const hashedpassword = await bcryptjs.hash(password,salt)
const payload = {
    name,
    email,
    profile,
    password : hashedpassword
}
const user = new userModel(payload)
const usersave = await user.save()

return response.status(201).json({
    message : "User created successfully",
    data :  usersave,
    success : true
})
    }catch(error){
        return response.status(500).json({
            message  : error.message || error,
            error : true
        })
    }
}
export default registerUser;