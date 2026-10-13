import { api } from "./api"
import type { ClassPayload, MessageResponse, SchoolClass } from "./types"

export const classApi = {
  getClasses: () => api.get<SchoolClass[]>("/api/classes"),
  create: (data: ClassPayload) => api.post<SchoolClass>("/api/classes", data),
  update: (id: number, data: ClassPayload) => api.put<SchoolClass>(`/api/classes/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/api/classes/${id}`),
}
