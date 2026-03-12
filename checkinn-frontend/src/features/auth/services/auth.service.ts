import { api } from "@/services/api";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),
};
