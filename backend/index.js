import express from "express";
import connectDB from "./config/database.js";
import dotenv from 'dotenv'; 
import userRoute from "./routes/userRoute.js"
import messageRoute from "./routes/messageRoute.js"
import cookieParser from "cookie-parser"; // Import cookie parser
import cors from "cors";
import { server } from "./socket/socket.js";
import { app } from "./socket/socket.js";


dotenv.config({});  

// const app = express();

const PORT = process.env.PORT || 8080;
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;

// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());
const corsOption={
    origin:FRONTEND_DOMAIN,
    credentials:true
};
app.use(cors(corsOption)); 


// routes
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);
 

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at prot ${PORT}`);
});
