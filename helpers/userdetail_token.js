import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
const userDetailFromToken = async(token)=>{
    if(!token){
        return{
            message : "session out",
            logout : true,
        }
    }
    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decode.id).select('-password')
    return user
}
export default userDetailFromToken;