import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';
import noteRouter from './routes/note.router';
import userRouter from './routes/user.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//bảo vệ
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
//router
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);
app.use('/api/user', userRouter);


export const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`PORT đã chạy`);
    });
}
startServer();