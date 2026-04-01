import { apiRequest } from "./api";

export type UserRole = "traveller" | "planner";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  success: true;
  data: {
    user: AuthUser;
    accessToken: string;
  };
};

type MeResponse = {
  success: true;
  data: AuthUser;
};

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export async function changePasswordApi(
  token,
  payload: {
    originalPassword: string;
    newPassword: string;
  },
) {
  return apiRequest<AuthResponse>("/auth/change-password", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function login(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function getMe(token: string) {
  return apiRequest<MeResponse>("/users/me", {
    method: "GET",
    token,
  });
}
