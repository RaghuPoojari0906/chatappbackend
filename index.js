import express, { request, response } from 'express';
import cors from 'cors';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';
import router from './router/index.js';
import cookieParser from 'cookie-parser';
import { app, server} from './socket/index.js'

// const app = express()
dotenv.config();
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URI,
    Credential: true, 
}
))
const PORT = process.env.PORT || 8080 


app.use(express.json())

app.get('/',(request,response) => {
    response.json  ({
        message :   "server is running" + PORT  
    })                                                                               
})

app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server runnng at "+ PORT)
        console.log('connectd to db')
    })
})
