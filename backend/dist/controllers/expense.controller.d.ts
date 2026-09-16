import { type Request, type Response, type NextFunction } from "express";
export declare const ExpenseController: {
    createExpense(req: Request, res: Response, next: NextFunction): Promise<void>;
    getExpenses(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChartData(req: Request, res: Response, next: NextFunction): Promise<void>;
    getExpenseById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateExpense(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteExpense(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=expense.controller.d.ts.map