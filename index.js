import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './Routers/userRouter.js';
import connectDB from './Database/Config.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api',router);

app.listen(process.env.PORT,()=>{
    console.log('app is listening')
})