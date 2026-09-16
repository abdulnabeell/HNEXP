import {} from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized: Token missing" });
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = {
            userId: payload.userId,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
//# sourceMappingURL=auth.middleware.js.map