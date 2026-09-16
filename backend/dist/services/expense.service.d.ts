export declare const ExpenseService: {
    createExpense(userId: number, data: {
        title: string;
        amount: number;
        category: string;
        description?: string | undefined;
    }): Promise<{
        id: number;
        title: string;
        amount: number;
        category: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
    getExpenses(userId: number, category?: string | undefined, search?: string | undefined): Promise<{
        id: number;
        title: string;
        amount: number;
        category: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }[]>;
    getSummary(userId: number): Promise<{
        totalSpending: number;
        totalExpenses: number;
        averageExpense: number;
        topCategory: {
            name: string;
            amount: number;
        } | null;
    }>;
    getChartData(userId: number, period: string): Promise<{
        period: string;
        data: {
            label: string;
            amount: number;
        }[];
    }>;
    getExpenseById(userId: number, id: number): Promise<{
        id: number;
        title: string;
        amount: number;
        category: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    } | null>;
    updateExpense(userId: number, id: number, data: {
        title?: string | undefined;
        amount?: number | undefined;
        category?: string | undefined;
        description?: string | undefined;
    }): Promise<{
        id: number;
        title: string;
        amount: number;
        category: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    } | null>;
    deleteExpense(userId: number, id: number): Promise<{
        id: number;
        title: string;
        amount: number;
        category: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    } | null>;
};
//# sourceMappingURL=expense.service.d.ts.map