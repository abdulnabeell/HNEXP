export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}
