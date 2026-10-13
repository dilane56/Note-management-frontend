import { api } from "./api"
import type { Evaluation, EvaluationPayload, MessageResponse } from "./types"

export const evaluationApi = {
  getEvaluations: () => api.get<Evaluation[]>("/api/evaluations"),
  create: (data: EvaluationPayload) => api.post<Evaluation>("/api/evaluations", data),
  update: (id: number, data: EvaluationPayload) => api.put<Evaluation>(`/api/evaluations/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/api/evaluations/${id}`),
}
