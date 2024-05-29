async function logout(request, response){
     try{
        const cookieOption = {
            http : true,
            success : true
        }

      return response.cookie('token','',cookieOption).status(200).json({
        message : "session out",
        succes: true
        
      })  
     }catch(error){
       return response.status(500).json({
        message : error.message || error,
        error : true
       })
     }
}
export default logout;