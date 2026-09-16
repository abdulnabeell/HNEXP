import api from "./api";
import type { Expense } from "../types";

export interface ExpenseSummary {
  totalSpending: number;
  totalExpenses: number;
  averageExpense: number;
  topCategory: { name: string; amount: number } | null;
  monthlyChange: number | null;
}

export interface ChartData {
  period: string;
  data: { label: string; amount: number }[];
}

export const ExpenseService = {
  async getExpenses(search?: string, category?: string): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    
    const response = await api.get<Expense[]>(`/expenses?${params.toString()}`);
    return response.data;
  },

  async createExpense(data: { title: string; amount: number; category: string; description?: string }): Promise<Expense> {
    const response = await api.post<Expense>("/expenses", data);
    return response.data;
  },

  async updateExpense(id: number, data: { title?: string; amount?: number; category?: string; description?: string }): Promise<Expense> {
    const response = await api.patch<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: number): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  async getSummary(): Promise<ExpenseSummary> {
    const response = await api.get<ExpenseSummary>("/expenses/summary");
    return response.data;
  },

  async getChartData(period: 'week' | 'month' | 'year'): Promise<ChartData> {
    const response = await api.get<ChartData>(`/expenses/summary/chart?period=${period}`);
    return response.data;
  }
};
