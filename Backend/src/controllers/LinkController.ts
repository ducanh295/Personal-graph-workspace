import { Response, Request } from "express";
import { z } from 'zod';
import link from "../models/Link";

export const getBackLinks = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const getLink = await link.find({
            targetNoteId: id,
            userId: (req as any).user.id
        }).populate('sourceNoteId', 'title') //chọc vào thàng sourceNoteId để lấy title ra

        return res.status(200).json({
            message: "Danh sách link của note này",
            backlinks: getLink
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "lỗi nhập liệu, vui lòng nhập lại !!",
                error: error.issues
            });
        }
        res.status(500).json({ error: "lỗi Database" });
    }

}