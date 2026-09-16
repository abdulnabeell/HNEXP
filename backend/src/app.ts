import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Expense Tracker API is running",
    });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error Caught:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;