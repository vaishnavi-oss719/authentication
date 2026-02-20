import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/config.js';
import userRouter from './Routers/user.router.js'

dotenv.config();

const app=express();
app.use(express.json());
connectDB();

app.use("/api/user",userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`server is Running port ${process.env.PORT}`);
})