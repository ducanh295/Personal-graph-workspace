import { Request, Response } from "express";
import User from "../models/User";
import Note from "../models/Note";
import Link from "../models/Link";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ProfileSchema = z.object({
    displayName: z.string().min(2),
    email: z.string().email(),
});

const PasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6)
});

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng." });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: "Lỗi máy chủ khi lấy thông tin người dùng." });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const data = ProfileSchema.parse(req.body);
        
        // Cấm trùng email
        const existingEmail = await User.findOne({ email: data.email, _id: { $ne: userId } });
        if (existingEmail) {
            return res.status(400).json({ error: "Địa chỉ email đã được sử dụng." });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            displayName: data.displayName,
            email: data.email
        }, { new: true }).select('-passwordHash');

        return res.status(200).json({ message: "Cập nhật thông tin thành công.", user: updatedUser });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: "Dữ liệu hồ sơ không hợp lệ." });
        return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật hồ sơ." });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { currentPassword, newPassword } = PasswordSchema.parse(req.body);
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy tài khoản." });

        const match = bcrypt.compareSync(currentPassword, user.passwordHash);
        if (!match) return res.status(400).json({ error: "Mật khẩu hiện tại không chính xác." });

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = newHash;
        await user.save();

        return res.status(200).json({ message: "Đổi mật khẩu thành công." });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự." });
        return res.status(500).json({ error: "Lỗi máy chủ khi đổi mật khẩu." });
    }
}

export const updateTheme = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { theme } = req.body; // 'light' | 'dark'
        if (theme !== 'light' && theme !== 'dark') return res.status(400).json({ error: "Giao diện không hợp lệ." });
        
        await User.findByIdAndUpdate(userId, { theme });
        return res.status(200).json({ message: "Cập nhật giao diện thành công." });
    } catch (error) {
        return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật giao diện." });
    }
}

export const exportData = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select('displayName email createdAt');
        const notes = await Note.find({ userId }).select('-userId -__v');
        const links = await Link.find({ userId }).select('-userId -__v');

        const dump = {
            pkg_version: "1.0-B2B",
            exportedAt: new Date(),
            user_info: user,
            notes_count: notes.length,
            links_count: links.length,
            payload: {
                notes,
                links
            }
        };

        // Gửi về định dạng File JSON Tải Xuống 
        res.setHeader('Content-disposition', 'attachment; filename=PKG_Brain_Backup.json');
        res.setHeader('Content-type', 'application/json');
        return res.status(200).send(JSON.stringify(dump, null, 2));

    } catch (error) {
        return res.status(500).json({ error: "Lỗi máy chủ khi xuất dữ liệu." });
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        // Xóa dữ liệu liên quan
        await Link.deleteMany({ userId });
        await Note.deleteMany({ userId });
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "Tài khoản của bạn đã được xóa thành công." });
    } catch (error) {
        return res.status(500).json({ error: "Lỗi máy chủ khi xóa tài khoản." });
    }
}
