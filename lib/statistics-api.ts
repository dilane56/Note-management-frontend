import { api } from "./api"
import type { ClassStatistics, StudentPerformance, SubjectStatistics } from "./types"

export const statisticsApi = {
  getClassStats: (classId: number, evaluationId: number) =>
    api.get<ClassStatistics>(`/api/statistics/class/${classId}/evaluation/${evaluationId}`),
  getSubjectStats: (classId: number, evaluationId: number) =>
    api.get<SubjectStatistics[]>(`/api/statistics/subjects/class/${classId}/evaluation/${evaluationId}`),
  getStudentStats: (classId: number, evaluationId: number) =>
    api.get<StudentPerformance[]>(`/api/statistics/students/class/${classId}/evaluation/${evaluationId}`),
}
