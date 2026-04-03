import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { z } from 'zod';
import User from "../models/User";

const RegisterSchema = z.object({
    displayName: z.string(),
    email: z.email().toLowerCase(),
    password: z.string().min(6)
});
export const RegisterController = async (req: Request, res: Response) => {
    try {
        const data = RegisterSchema.parse(req.body);
        //kiếm tra xem có thằng nào email nào trong database ko ?
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json("Email ĐÃ tồn tại trong database");
        }
        //băm pass (hash pass)
        const salt = bcrypt.genSaltSync(10); //dùng genSaltSync để chèn thêm xay ra mũ (n) ký tự ngẫu nhiên
        const hashedPassword = bcrypt.hashSync(data.password, salt);

        //Lưu vào database
        const newUser = await User.create({
            displayName: data.displayName,
            email: data.email,
            passwordHash: hashedPassword
        });
        //tạo token 
        const medallion = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        //trả về kết quả khi thành công
        return res.status(201).json({ message: 'Đăng ký thành công', token: medallion, user: { id: newUser._id, email: newUser.email } })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Nhập dữ liệu sai ! vui lòng kiểm tra lại !",
                errors: error.issues
            });
        }
        res.status(500).json({ error: "lỗi Database" });
    }
}