import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { ExpenseService } from "../services/expense.service.js";

const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

const updateExpenseSchema = createExpenseSchema.partial();

export const ExpenseController = {
  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validatedData = createExpenseSchema.parse(req.body);
      const expense = await ExpenseService.createExpense(userId, validatedData);
      res.status(201).json(expense);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.issues });
      } else {
        next(error);
      }
    }
  },

  async getExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const expenses = await ExpenseService.getExpenses(userId, category, search);
      res.status(200).json(expenses);
    } catch (error: any) {
      next(error);
    }
  },

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const summary = await ExpenseService.getSummary(userId);
      res.status(200).json(summary);
    } catch (error: any) {
      next(error);
    }
  },

  async getChartData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const period = req.query.period as string || "month";
      
      const validPeriods = ["week", "month", "year"];
      if (!validPeriods.includes(period)) {
        res.status(400).json({ error: "Invalid period. Supported periods are: week, month, year" });
        return;
      }
      
      const chartData = await ExpenseService.getChartData(userId, period);
      res.status(200).json(chartData);
    } catch (error: any) {
      next(error);
    }
  },

  async getExpenseById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id as string, 10);
      
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid expense ID format" });
        return;
      }
      
      const expense = await ExpenseService.getExpenseById(userId, id);
      if (!expense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }
      
      res.status(200).json(expense);
    } catch (error: any) {
      next(error);
    }
  },

  async updateExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id as string, 10);
      
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid expense ID format" });
        return;
      }
      
      const validatedData = updateExpenseSchema.parse(req.body);
      const expense = await ExpenseService.updateExpense(userId, id, validatedData);
      
      if (!expense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }
      
      res.status(200).json(expense);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.issues });
      } else {
        next(error);
      }
    }
  },

  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id as string, 10);
      
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid expense ID format" });
        return;
      }
      
      const deletedExpense = await ExpenseService.deleteExpense(userId, id);
      if (!deletedExpense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }
      
      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  },
};
