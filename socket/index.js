import  express from 'express';
import { Server } from 'socket.io';
import  http  from 'http';
import userDetailFromToken from '../helpers/userdetail_token.js';
import cors from 'cors';
import userModel from '../models/userModel.js';
import { conversationModel, messageModel} from '../models/conversation.js';
import getConver from '../helpers/getConver.js';




const app = express()
app.use(cors());

const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origins : process.env.FRONTEND_URI,
        Credential: true
    }
})

const online = new Set()

io.on('connection',async(socket)=>{
   

   const token = socket.handshake?.auth?.token
   
   
   const user = await userDetailFromToken(token)
   
   
   socket.join(user?._id?.toString())
   online.add(user?._id?.toString())
   io.emit('online',Array.from(online))

   socket.on('message',async(userId)=>{
    
    const userDetails = await userModel.findById(userId).select('-password')

    const payload= {
        _id : userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile: userDetails?.profile,
        online: online.has(userId)
    }
    socket.emit('message-user',payload)
   
    const getConversation = await conversationModel.findOne({
        "$or" : [
            {sender : user?._id, receiver : userId},
            {sender : userId, receiver : user?._id}

        ]
      }

      ).populate('messages').sort({updatedAt:-1})
     
socket.emit('message',getConversation?.messages)
    })
    
    socket.on('new message',async(data)=>{
        let conversation = await conversationModel.findOne({
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver},
                {sender : data?.receiver, receiver : data?.sender}

            ]
        })
        console.log(conversation)
        if(!conversation){
const createConversation = await conversationModel({
    sender : data?.sender,
    receiver : data?.receiver

})
conversation = await createConversation.save()
        }
        const message = new messageModel({
            text : data?.text,
          imageUrl : data?.imageUrl,
          videoUrl : data?.videoUrl,
          msgBy : data?.msgBy
        })
        const saveMessage = await message.save()
      const updateConversation = await conversationModel.updateOne({
        _id : conversation?._id},{
            "$push" : {messages : saveMessage?._id}
        
      })  
      const getConversation = await conversationModel.findOne({
        "$or" : [
            {sender : data?.sender, receiver : data?.receiver},
            {sender : data?.receiver, receiver : data?.sender}

        ]
      }

      ).populate('messages').sort({updatedAt:-1})
      io.to(data?.sender).emit('message',getConversation?.messages || [])
      io.to(data?.receiver).emit('message',getConversation?.messages || [])
      const conversationSender = await getConver(data?.sender)
      const conversationReceiver = await getConver(data?.receiver)


      io.to(data?.sender).emit('conversation',conversationSender)
      io.to(data?.receiver).emit('conversation',conversationReceiver)
     
      
    }
    )
    socket.on('sidebar',async(currentUser)=>{
        console.log(currentUser)
        const conversation = await getConver(currentUser)
     
        socket.emit('conversation',conversation)
    })
    socket.on('seen',async(msgBy)=>{
        let conversation = await conversationModel.findOne({
            "$or" : [
                {sender : user?._id, receiver : msgBy},
                {sender : msgBy, receiver : user?._id}

            ]
        
        
       })
       const conversationMessages = conversation?.messages || []
        const updateMessages = await messageModel.updateMany(
            {_id : {"$in" : conversationMessages}, msgBy : msgBy },
            {"$set" : {seen : true}}
        )
        const conversationSender = await getConver(user?._id?.toString())
        const conversationReceiver = await getConver(msgBy)
  
  
        io.to(user?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgBy).emit('conversation',conversationReceiver)
       
        
    })
   
    socket.on('disconnect',()=>{
        online.delete(user?._id?.toString())
        console.log('disconnect',socket.id)
    })

})
export {app, server}
