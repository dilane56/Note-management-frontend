import { api } from "./api"
import type { SchoolClass, Subject, TeacherDashboard } from "./types"

export const teacherApi = {
  getClasses: (teacherId: number) => api.get<SchoolClass[]>(`/api/teachers/${teacherId}/classes`),
  getSubjects: (teacherId: number) => api.get<Subject[]>(`/api/teachers/${teacherId}/subjects`),
  getDashboard: (teacherId: number) =>
    api.get<TeacherDashboard>(`/api/statistics/teacher/${teacherId}/dashboard`),
}
