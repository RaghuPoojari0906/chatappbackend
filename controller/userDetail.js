import userDetailFromToken from "../helpers/userdetail_token.js"

async function userDetail(request, response){
    try{
        const token = request.cookies.token || ""
const user = await userDetailFromToken(token)
return response.status(200).json({
    message : "user detasil",
    data : user
})

    }catch(error){
        return response.status(500).json({
        message : error.message || error,
        error : true
    })
}
}
export default userDetail;