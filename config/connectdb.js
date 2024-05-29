import mongoose from "mongoose";

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        const connection = mongoose.connection
        connection.on("connected",()=>{
            console.log("connected to db")
        });
        connection.on("error",(error)=>{
            console.log("something is wrong",error)
        });
    }catch(error){
       console.log(error);
    }
}
export default connectDB;