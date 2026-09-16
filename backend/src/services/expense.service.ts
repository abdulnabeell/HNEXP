import prisma from "../lib/prisma.js";

export const ExpenseService = {
  async createExpense(userId: number, data: { title: string; amount: number; category: string; description?: string | undefined }) {
    return prisma.expense.create({
      data: {
        userId,
        title: data.title,
        amount: data.amount,
        category: data.category,
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
  },

  async getExpenses(userId: number, category?: string | undefined, search?: string | undefined) {
    return prisma.expense.findMany({
      where: {
        userId,
        ...(category ? { category } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getSummary(userId: number) {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      select: { amount: true, category: true, createdAt: true },
    });

    if (expenses.length === 0) {
      return { totalSpending: 0, totalExpenses: 0, averageExpense: 0, topCategory: null, monthlyChange: null };
    }

    const totalExpenses = expenses.length;
    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageExpense = totalSpending / totalExpenses;

    const categoryMap = new Map<string, number>();
    expenses.forEach(exp => {
      categoryMap.set(exp.category, (categoryMap.get(exp.category) || 0) + exp.amount);
    });

    let topCategory = null;
    let maxAmount = -1;
    for (const [name, amount] of categoryMap.entries()) {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = { name, amount };
      }
    }

    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const currentMonthSpending = expenses
      .filter(e => e.createdAt >= firstDayCurrentMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    const lastMonthSpending = expenses
      .filter(e => e.createdAt >= firstDayLastMonth && e.createdAt < firstDayCurrentMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    let monthlyChange = null;
    if (lastMonthSpending > 0) {
      monthlyChange = ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;
    } else if (lastMonthSpending === 0 && currentMonthSpending > 0) {
      monthlyChange = 100;
    } else if (lastMonthSpending === 0 && currentMonthSpending === 0) {
      monthlyChange = 0;
    }

    return { totalSpending, totalExpenses, averageExpense, topCategory, monthlyChange };
  },

  async getChartData(userId: number, period: string) {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      select: { amount: true, createdAt: true },
    });

    const dataMap = new Map<string, number>();
    
    expenses.forEach(exp => {
      let label = "";
      const date = exp.createdAt;
      
      if (period === "week") {
        label = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (period === "month") {
        label = date.toLocaleDateString("en-US", { day: "2-digit" });
      } else if (period === "year") {
        label = date.toLocaleDateString("en-US", { month: "short" });
      } else {
        label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      dataMap.set(label, (dataMap.get(label) || 0) + exp.amount);
    });

    const data = Array.from(dataMap.entries()).map(([label, amount]) => ({
      label,
      amount,
    }));

    return { period, data };
  },

  async getExpenseById(userId: number, id: number) {
    return prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  async updateExpense(userId: number, id: number, data: { title?: string | undefined; amount?: number | undefined; category?: string | undefined; description?: string | undefined }) {
    // Verify ownership before updating
    const expense = await this.getExpenseById(userId, id);
    if (!expense) {
      return null;
    }

    return prisma.expense.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.amount !== undefined ? { amount: data.amount } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
  },

  async deleteExpense(userId: number, id: number) {
    // Verify ownership before deleting
    const expense = await this.getExpenseById(userId, id);
    if (!expense) {
      return null;
    }

    return prisma.expense.delete({
      where: { id },
    });
  },
};
