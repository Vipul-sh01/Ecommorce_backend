import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import dotenv from 'dotenv';
dotenv.config({
    path:'./env'
});
import express from "express";
const app = express();

(async()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log("mongoDB connected");
       app.on("error ", (error)=>{
        console.log("ERROR: ", error);
        throw error;
       })

       app.listen(process.env.PORT, ()=>{
        console.log(`server start at ${process.env.PORT}`);
       })
    }
    catch(error){
        console.error("ERROR ", error);
        throw error
    }
})();