import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";
export const AuthService = {
    async register(data) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("Email already in use");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token,
        };
    },
    async getMe(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return null;
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
};
//# sourceMappingURL=auth.service.js.map