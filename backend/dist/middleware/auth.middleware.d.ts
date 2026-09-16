import { type Request, type Response, type NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
            };
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map