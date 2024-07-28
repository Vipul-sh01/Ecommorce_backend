import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: Process.env.CORS_ORIGIN,
    Credential: true,
}));

app.use(express.json({limit: "18kb"}));
app.use(express.utlencoded({limit: "18kb", extends: true}));
app.use(express.static("public"));
app.use(express(cookieParser()));











 export {app};