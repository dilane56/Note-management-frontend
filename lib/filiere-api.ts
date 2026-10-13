import { api } from "./api"
import type { Filiere, MessageResponse } from "./types"

export const filiereApi = {
  getFilieres: () => api.get<Filiere[]>("/api/filieres"),
  create: (data: { name: string }) => api.post<Filiere>("/api/filieres", data),
  update: (id: number, data: { name: string }) => api.put<Filiere>(`/api/filieres/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/api/filieres/${id}`),
}
