import { conversationModel } from "../models/conversation.js"


const getConver = async(currentUser)=>{
    if(currentUser){
        const currentConversation = await conversationModel.find({
            "$or" : [
                { sender : currentUser },
                { receiver : currentUser }
            ]
            
        }).sort({updatedAt : -1}).populate('messages').populate('sender').populate('receiver')
        const conversation = currentConversation.map((conver)=>{
            const countUnseen = conver?.messages?.reduce((preve,curr) =>{
                const msgBy = curr?.msgBy?.toString()
                if(msgBy !== currentUser){
                    
                    return preve + (curr?.seen ? 0 : 1)                
                }else{
                    return preve
                }
                },0)
            return{
                _id : conver?._id,
                sender : conver?.sender,
                reciver : conver?.receiver,
                unseenmsg : countUnseen,
                lastmsg : conver.messages[conver?.messages?.length - 1]
            }
        })
        return conversation
}else{
    return[]
}
 }

export default getConver;