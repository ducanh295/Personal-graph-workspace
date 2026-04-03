import { Response, Request, raw } from "express";
import { z } from 'zod';
import Note from "../models/Note";
import Link from "../models/Link";

const NoteSchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string())
});
const PaginationSchema = z.object({
    page: z.preprocess((val) => val === undefined ? 1 : Number(val), z.number().min(1)),
    limit: z.preprocess((val) => val === undefined ? 20 : Number(val), z.number().min(1).max(100))
});

export const getAllNotes = async (req: Request, res: Response) => {
    try {
        // Xử lý Pagination mềm dẻo không qua Zod để tránh nhảy trang NaN với req.query của Express
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        //điểm tổng số lượng item
        const TotalItem = await Note.countDocuments({ userId: (req as any).user.id });
        //tìm offset - 1 trang có nao nhiều offset
        const offset = (page - 1) * limit;
        const getNotes = await Note.find({ userId: (req as any).user.id }).sort({ updatedAt: -1 }).skip(offset).limit(limit);
        return res.status(200).json({ getNotes, TotalItem });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Lỗi nhập liệu, vui lòng kiểm tra lại.",
                error: error.issues
            });
        }
        res.status(500).json({ error: "Lỗi máy chủ cơ sở dữ liệu." });
    }
}

export const createNote = async (req: Request, res: Response) => {
    try {
        const data = NoteSchema.parse(req.body);
        const currentUserId = (req as any).user.id;
        const newNote = await Note.create({ userId: currentUserId, ...data });

        // Xử lý liên kết từ mảng links[] gửi từ Frontend (Dropdown UI)
        const explicitLinks = req.body.links as string[] | undefined;
        if (Array.isArray(explicitLinks) && explicitLinks.length > 0) {
            const uniqueTargetIds = [...new Set(explicitLinks)].filter(id => id !== newNote._id.toString());

            if (uniqueTargetIds.length > 0) {
                const existingNotes = await Note.find({ _id: { $in: uniqueTargetIds } }).select('_id');
                const validTargetIds = existingNotes.map(note => note._id.toString());

                if (validTargetIds.length > 0) {
                    const linkToInsert = validTargetIds.map(validId => ({
                        sourceNoteId: newNote._id,
                        targetNoteId: validId,
                        userId: currentUserId
                    }));
                    await Link.insertMany(linkToInsert);
                }
            }
        }

        return res.status(201).json({ newNote, message: "Thêm dữ liệu thành công" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.",
                error: error.issues
            });
        }
        res.status(500).json({ error: "Lỗi máy chủ cơ sở dữ liệu." });
    }
}


export const updateNotes = async (req: Request, res: Response) => {
    try {
        const data = NoteSchema.parse(req.body);
        const currentUserId = (req as any).user.id;
        const noteId = req.params.id;

        const editsNote = await Note.findOneAndUpdate(
            { _id: noteId, userId: currentUserId }, 
            { ...data }, 
            { new: true }
        );
        if (!editsNote) return res.status(404).json({ error: "Không tìm thấy ghi chú." });

        // Đồng bộ bảng Link: Xóa links cũ (outgoing) rồi tạo lại từ mảng links[]
        const incomingLinks = req.body.links as string[] | undefined;
        if (Array.isArray(incomingLinks)) {
            // Xóa tất cả outgoing links cũ của note này
            await Link.deleteMany({ sourceNoteId: noteId, userId: currentUserId });

            // Lọc ra các target hợp lệ (tồn tại trong DB, không trỏ về chính mình)
            const uniqueTargetIds = [...new Set(incomingLinks)].filter(id => id !== noteId);
            if (uniqueTargetIds.length > 0) {
                const existingNotes = await Note.find({ _id: { $in: uniqueTargetIds } }).select('_id');
                const validTargetIds = existingNotes.map(n => n._id.toString());

                const linkDocs = validTargetIds.map(targetId => ({
                    sourceNoteId: noteId,
                    targetNoteId: targetId,
                    userId: currentUserId
                }));
                if (linkDocs.length > 0) {
                    await Link.insertMany(linkDocs);
                }
            }
        }

        return res.status(201).json({ editsNote });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.",
                error: error.issues
            });
        }
        res.status(500).json("Lỗi máy chủ cơ sở dữ liệu.");
    }
}

export const deleteNotes = async (req: Request, res: Response) => {
    try {
        const noteId = req.params.id;
        const userId = (req as any).user.id;
        const deletesNote = await Note.findOneAndDelete({ _id: noteId, userId });

        // Xóa tất cả Link liên quan (đi và đến) của note này
        await Link.deleteMany({
            $or: [
                { sourceNoteId: noteId },
                { targetNoteId: noteId }
            ]
        });

        return res.status(201).json({ deletesNote });
    } catch (error) {
        res.status(500).json("Lỗi máy chủ cơ sở dữ liệu.");
    }
}

export const getOneNote = async (req: Request, res: Response) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: (req as any).user.id });
        if (!note) return res.status(404).json({ error: "Không tìm thấy ghi chú." });
        return res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: "Lỗi máy chủ cơ sở dữ liệu." });
    }
}

export const getBacklinks = async (req: Request, res: Response) => {
    try {
        const links = await Link.find({ targetNoteId: req.params.id, userId: (req as any).user.id })
            .populate('sourceNoteId', 'title _id');
        return res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ error: "Lỗi truy xuất liên kết." });
    }
}

// Lấy danh sách ghi chú mà note này ĐÃ LIÊN KẾT ĐẾN (outgoing links)
export const getOutgoingLinks = async (req: Request, res: Response) => {
    try {
        const links = await Link.find({ sourceNoteId: req.params.id, userId: (req as any).user.id })
            .populate('targetNoteId', 'title _id');
        return res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ error: "Lỗi truy xuất liên kết đi." });
    }
}

export const getGraphData = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        
        // 1. Lấy toàn bộ Note (Chỉ cần ID và Title)
        const notes = await Note.find({ userId }).select('_id title');
        
        // 2. Lấy toàn bộ Link
        const links = await Link.find({ userId }).select('sourceNoteId targetNoteId');

        const graphNodes = notes.map(note => ({
            id: note._id.toString(),
            name: note.title,
            val: 2 // Khởi tạo độ lớn mặc định
        }));

        const nodeIds = new Set(graphNodes.map(n => n.id));

        const graphLinks = links
            .filter(link => link.sourceNoteId && link.targetNoteId)
            .map(link => ({
                source: link.sourceNoteId!.toString(),
                target: link.targetNoteId!.toString()
            }))
            .filter(link => nodeIds.has(link.source) && nodeIds.has(link.target));

        // 4. Tính toán độ lớn (val) của Node dựa trên PageRank (Số Backlink trỏ vào nó)
        graphLinks.forEach(link => {
            const targetNode = graphNodes.find(n => n.id === link.target);
            if (targetNode) {
                targetNode.val += 1; // Nút nào bị trỏ nhiều thì mập lên
            }
        });

        return res.status(200).json({
            nodes: graphNodes,
            links: graphLinks
        });

    } catch (error) {
        res.status(500).json({ error: "Lỗi truy xuất dữ liệu đồ thị đồ họa." });
    }
}

export const searchNotes = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const q = req.query.q as string;
        
        if (!q || q.trim() === '') {
            return res.status(200).json([]);
        }

        const regex = new RegExp(q, 'i'); // Case-insensitive search
        
        const results = await Note.find({
            userId,
            $or: [
                { title: { $regex: regex } },
                { content: { $regex: regex } }
            ]
        }).sort({ updatedAt: -1 }).limit(20);

        return res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: "Lỗi thực thi truy vấn tìm kiếm." });
    }
}