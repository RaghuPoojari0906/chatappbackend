import userModel from '../models/userModel.js'
async function searchUser(request,response){
    try{
       const { search } = request.body
       const query = new RegExp(search,"i","g")
       const user = await userModel.find({
          "$or" : [
            {name : query},
            {email : query}
          ]
       }).select("-password")
       return response.json({
        message : 'all user',
        data : user,
        success : true
       })
       
    }catch(error){
        return response.status(500).json({
            message: error.message || error,
             error : true
        })
        
    }
}
export default searchUser;