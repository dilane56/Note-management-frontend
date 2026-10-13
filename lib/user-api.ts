import { api } from "./api"
import type { MessageResponse, Role, StudentPayload, StudentResponse, UserPayload, UserResponse } from "./types"

const endpointFor = (role: Role) =>
  role === "ADMIN" ? "/api/v1/admins" : role === "TEACHER" ? "/api/teachers" : "/api/students"

export const userApi = {
  getUsers: () => api.get<UserResponse[]>("/api/users"),

  getStudent: (id: number) => api.get<StudentResponse>(`/api/students/${id}`),

  create: (role: Role, data: UserPayload | StudentPayload) => api.post<UserResponse>(endpointFor(role), data),

  update: (role: Role, id: number, data: UserPayload | StudentPayload) =>
    api.put<UserResponse>(`${endpointFor(role)}/${id}`, data),

  delete: (id: number) => api.delete<MessageResponse>(`/api/users/${id}`),
}
