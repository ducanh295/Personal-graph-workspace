import { Router } from "express";
import { createNote, deleteNotes, getAllNotes, updateNotes, getOneNote, getBacklinks, getOutgoingLinks, getGraphData, searchNotes } from "../controllers/NotesController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getDashboardStats, getDashboardContent } from "../controllers/StatsController";
const router = Router();

// Toàn bộ các cổng bảo mật (authMiddleware) đã được khoá lại: Bạn đéo có Token là văng mẹ luôn Khỏi Đứa Nào Hack API.
router.get('/', authMiddleware, getAllNotes);
router.get('/graph/all', authMiddleware, getGraphData); // Lưới Thần Kinh Không Gian PKG
router.get('/detail/:id', authMiddleware, getOneNote); // Thêm Nón Cối Chiếu Một Chạn
router.get('/backlinks/:id', authMiddleware, getBacklinks);
router.get('/outlinks/:id', authMiddleware, getOutgoingLinks);
router.post('/newNote', authMiddleware, createNote);
router.put('/editsNote/:id', authMiddleware, updateNotes); // Fix Tham Số Tọa Độ /:id Thất Truyền
router.delete('/deleteNote/:id', authMiddleware, deleteNotes); // Cương quyết Bắt Nạt Lỗi /:id Không Gắn
router.get("/dashboard/stats", authMiddleware, getDashboardStats);
router.get("/dashboard/content", authMiddleware, getDashboardContent); // Lõi Động Dashboard
router.get("/search", authMiddleware, searchNotes); // Máy Queét Full Text Tốc Độ Cao

export default router;