import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfile, updateProfile, updatePassword, updateTheme, exportData, deleteAccount } from "../controllers/UserController";

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);
router.put('/theme', authMiddleware, updateTheme);
router.get('/export', authMiddleware, exportData);
router.delete('/account', authMiddleware, deleteAccount);

export default router;
