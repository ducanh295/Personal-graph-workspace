import { Request, Response } from "express";
import Note from "../models/Note";
import mongoose from "mongoose";
import Link from "../models/Link";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId((req as any).user.id);
        //Móc giờ active
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const [totalNotes, totalLinks, activeNotes, uniqueDatesArray] = await Promise.all([
            //bấm Counter đếm tổng note

            Note.countDocuments({ userId: userId }),
            Link.countDocuments({ userId: userId }),
            Note.countDocuments({
                userId: userId,
                updatedAt: { $gte: oneDayAgo }
            }),

            Note.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }
                    }
                },
                {
                    $sort: { _id: -1 }
                }
            ])
        ]);
        //thuật toán streak
        let streakDays = 0;
        const activeDates = uniqueDatesArray.map(item => item._id);//mảng chứa cập ngày active
        if (activeDates.length > 0) {
            let checkDate = new Date();
            const todayStr = checkDate.toISOString().split('T')[0];
            let yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

            //bắt lỗi khoảng trống ux
            if (!activeDates.includes(todayStr) && activeDates.includes(yesterdayStr)) {
                checkDate.setDate(checkDate.getDate() - 1);
            }

            while (true) {
                const mapStr = checkDate.toISOString().split('T')[0];
                if (activeDates.includes(mapStr)) {
                    streakDays++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }
        // Bước 2: Ném toàn bộ đống Note vừa lọc được vào CHUNG MỘT CÁI THAU, sau đó bảo hệ thống đếm ++1 cho Tổng Số Ghi Chú.
        const dashboardResponse = [
            {
                label: "Tổng số ghi chú",
                value: totalNotes,
                delta: "▲ Tất cả ghi chú"
            },
            {
                label: "Tổng số liên kết",
                value: totalLinks,
                delta: "▲ Tất cả liên kết"
            },
            {
                label: "Ghi chú đang active",
                value: activeNotes,
                delta: "▲ Trong 24h qua"
            },
            {
                label: "Ngày streak",
                value: streakDays,
                delta: "▲ Số ngày liên tiếp"
            }

        ];
        return res.status(200).json(dashboardResponse);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Lỗi máy chủ khi lấy dữ liệu tổng quan." })
    }
}

export const getDashboardContent = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId((req as any).user.id);
        
        // Lọc Ghi Chú
        const recentNotesRaw = await Note.find({ userId }).sort({ updatedAt: -1 }).limit(5);
        // Note lãng quên thì lọc updatedAt tăng dần (cũ nhất), nhưng mà phải loại mấy note mới tạo nha. Tạm thời cứ sort 1
        const forgottenNotesRaw = await Note.find({ userId }).sort({ updatedAt: 1 }).limit(5);

        // Func mapping chọc vào đếm Link
        const enrichWithBacklinks = async (notes: any[]) => {
            return Promise.all(notes.map(async (note) => {
                const backlinksCount = await Link.countDocuments({ targetNoteId: note._id });
                return {
                    _id: note._id.toString(),
                    title: note.title,
                    updatedAt: note.updatedAt,
                    tags: note.tags || [],
                    backlinks: backlinksCount
                };
            }));
        };

        const recentNotes = await enrichWithBacklinks(recentNotesRaw);
        const forgottenNotes = await enrichWithBacklinks(forgottenNotesRaw);

        // Gợi Ý Liên Kết (Thuật toán Match chung Tag)
        const linkSuggestions: any[] = [];
        const allNotesForTags = await Note.find({ userId, tags: { $exists: true, $not: { $size: 0 } } }).select('_id title tags');
        const allLinks = await Link.find({ userId }).select('sourceNoteId targetNoteId');
        
        const linkSet = new Set(allLinks.map(l => `${l.sourceNoteId}_${l.targetNoteId}`));
        
        // Vòng lặp O(N^2) Hơi Nặng (Nhưng Note cá nhân thì ít)
        outerLoop:
        for (let i = 0; i < allNotesForTags.length; i++) {
            for (let j = i + 1; j < allNotesForTags.length; j++) {
                const noteA = allNotesForTags[i];
                const noteB = allNotesForTags[j];
                
                // Cắt giao tìm Thẻ điểm chung
                const sharedTags = noteA.tags.filter((t: string) => noteB.tags.includes(t));
                if (sharedTags.length > 0) {
                    // Cầu chì phát hiện: Đã từng Trỏ Link chưa?
                    const hasLink = linkSet.has(`${noteA._id}_${noteB._id}`) || linkSet.has(`${noteB._id}_${noteA._id}`);
                    if (!hasLink) {
                        linkSuggestions.push({
                            source: { _id: noteA._id.toString(), title: noteA.title },
                            target: { _id: noteB._id.toString(), title: noteB.title },
                            sharedTags
                        });
                        // Đủ 3 cặp đôi hoàn cảnh thì Ngừng Lặp Đỡ Cháy Máy!
                        if (linkSuggestions.length >= 3) break outerLoop;
                    }
                }
            }
        }

        return res.status(200).json({
            recentNotes,
            forgottenNotes,
            linkSuggestions
        });

    } catch (error) {
        console.error("Lỗi Dashboard Content:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi lấy nội dung chi tiết." });
    }
}