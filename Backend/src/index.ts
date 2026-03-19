import express from 'express';
import dotenv from 'dotenv';
// Sếp nhớ import hàm connectDB từ file ./config/db.ts nhé!

// Load biến môi trường từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// NHIỆM VỤ CỦA SẾP:
// 1. Gọi hàm connectDB() để nối máy xuống database
// 2. Chạy server bằng lệnh app.listen(PORT, callback)
//    (Chỉ khởi chạy app.listen khi connectDB đã xong - Sếp có thể dùng async/await hoặc .then())

// Mớm sẵn 1 middleware để server hiểu được file JSON từ Body
app.use(express.json());

// Code khởi chạy server ở đây...
