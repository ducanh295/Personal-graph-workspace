import { Response, Request } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import UserModel from "../models/User";

const LoginSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string()
});

export const LoginController = async (req: Request, res: Response) => {
    try {
        const data = LoginSchema.parse(req.body);
        const user = await UserModel.findOne({ email: data.email });
        if (!user) {
            return res.status(404).json("Email này không tồn tại");
        }

        //dịch ngược thành pass
        const match = bcrypt.compareSync(data.password, user.passwordHash);
        if (match === false) {
            return res.status(400).json({ error: 'Pass không đúng, vui lòng nhập lại' });
        }

        const medallion = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ message: 'Đang nhập thành công', token: medallion, user: { id: user._id, email: user.email } })
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