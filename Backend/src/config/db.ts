import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URI as string;
        if (!mongoUrl) {
            throw new Error("lỗi: chua khai báo MONGO_URL trong .env");
        }
        const conn = await mongoose.connect(mongoUrl);
        console.log(`kết nối thành công vào database:" ${conn.connection.host}`);
    } catch (error) {
        console.error('lỗi database mongodb:', error);
        process.exit(1)
    }
};

export default connectDB;