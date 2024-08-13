import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
}));

app.use(express.json({limit: "18kb"}));
app.use(express.urlencoded({limit: "18kb", extends: true}));
app.use(express.static("public"));
app.use(cookieParser());  


//routes imports
import userRouter from './routes/user.routes.js';
app.use("/api/v1/users", userRouter);

 export {app};