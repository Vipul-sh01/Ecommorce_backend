import dotenv from 'dotenv';
import connectDB from './db/server.db.js';
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
});


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server start at port : ${process.env.PORT || 4000}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed: ", err);
    });