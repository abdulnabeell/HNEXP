import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all expense routes
router.use(authMiddleware);

router.post("/", ExpenseController.createExpense);
router.get("/", ExpenseController.getExpenses);
router.get("/summary", ExpenseController.getSummary);
router.get("/summary/chart", ExpenseController.getChartData);
router.get("/:id", ExpenseController.getExpenseById);
router.patch("/:id", ExpenseController.updateExpense);
router.delete("/:id", ExpenseController.deleteExpense);

export default router;
