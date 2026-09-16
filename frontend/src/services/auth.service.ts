import api from "./api";
import type { User } from "../types";

export const AuthService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  }
};
