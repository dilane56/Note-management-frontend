import { api } from "./api"
import type { Grade, GradePayload, MessageResponse, StudentResponse } from "./types"

export const gradeApi = {
  getStudentGrades: (studentId: number) => api.get<Grade[]>(`/api/grades/students/${studentId}/grades`),

  /** Étudiants de la classe de la matière, avec leurs notes. */
  getStudentsBySubject: (subjectId: number) =>
    api.get<StudentResponse[]>(`/api/grades/subjects/${subjectId}/students`),

  create: (data: GradePayload) => api.post<Grade>("/api/grades", data),
  update: (id: number, data: GradePayload) => api.put<Grade>(`/api/grades/${id}`, data),
  delete: (id: number) => api.delete<MessageResponse>(`/api/grades/${id}`),
  updateComment: (id: number, comment: string) =>
    api.patch<Grade>(`/api/grades/${id}/comment`, undefined, { comment }),
}
