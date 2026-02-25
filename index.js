import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/config.js';
import userRouter from './Routers/user.router.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
connectDB();

app.use("/api/user",userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`server is Running port ${process.env.PORT}`);
})