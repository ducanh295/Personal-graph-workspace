import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ error: "Ko có token" });
    }
    try {
        const clearToken = token.split(" ")[1];
        const payloadChuan = jwt.verify(clearToken, process.env.JWT_SECRET as string);
        (req as any).user = payloadChuan;
        console.log("Cục payload gắn trên jwt: ", payloadChuan);
        next();
    } catch (error) {
        return res.status(403).json({ error: "token ko đúng hoặc hết hạn" })
    }
}