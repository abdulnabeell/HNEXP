import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service.js";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await AuthService.register(validatedData);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.issues });
      } else if (error.message === "Email already in use") {
        res.status(409).json({ error: error.message });
      } else {
        next(error);
      }
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);
      res.status(200).json({ message: "Login successful", ...result });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.issues });
      } else if (error.message === "Invalid credentials") {
        res.status(401).json({ error: error.message });
      } else {
        next(error);
      }
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getMe(userId);
      
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  },
};
