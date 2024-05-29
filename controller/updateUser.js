import userDetailFromToken from "../helpers/userdetail_token.js"
import userModel from "../models/userModel.js"

async function updateUser(request,response){
    try{
        const token = request.cookies.token || ""
        const user = await userDetailFromToken(token)
        const {name,profile} = request.body
        const updateuser = await userModel.updateOne({_id : user._id},{
            name,
            profile
        })
        const userInfo = await userModel.findById(user._id)
        
        return response.json({
            message : "Updated successfully",
            data : userInfo,
            success : true
        })

    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}
export default updateUser;