import { request } from "./api"
import type { LoginRequest, LoginResponse, TokenInfo } from "./types"

export const authApi = {
  login: (credentials: LoginRequest) =>
    request<LoginResponse>("/api/auth/login", { method: "POST", body: credentials, auth: false }),

  /** Vérifie le token stocké ; lève une ApiError 401 s'il est expiré ou invalide. */
  validateToken: () => request<TokenInfo>("/api/auth/validate-token"),
}
