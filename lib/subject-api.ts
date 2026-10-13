import { api } from "./api"
import type { MessageResponse, Subject, SubjectPayload } from "./types"

export const subjectApi = {
  getSubjects: () => api.get<Subject[]>("/api/subjects"),
  create: (data: SubjectPayload) => api.post<Subject>("/api/subjects", data),
  update: (id: number, data: SubjectPayload) => api.put<Subject>(`/api/subjects/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/api/subjects/${id}`),
  assignTeacher: (teacherId: number, subjectId: number) =>
    api.patch<unknown>(`/api/teachers/${teacherId}/assign-subject/${subjectId}`),
}
