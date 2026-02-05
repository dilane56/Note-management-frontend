import { api } from './api'

export interface TeacherSubject {
  id: number
  name: string
  coefficient: number
  className: string
  teachers: Array<{
    teacherId: number
    teacherFirstName: string
    teacherLastName: string
  }>
}

export const teacherSubjectApi = {
  // Récupérer les matières de l'enseignant connecté
  getMySubjects: async (teacherId: number): Promise<TeacherSubject[]> => {
    const response = await api.get(`/api/teachers/${teacherId}/subjects`)
    return response
  },

  // Mettre à jour le coefficient d'une matière
  updateSubjectCoefficient: async (subjectId: number, coefficient: number, token?: string): Promise<TeacherSubject> => {
    try {
      const response = await api.patch(`/api/subjects/${subjectId}/coefficient?coefficient=${coefficient}`, undefined, token)
      return response
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du coefficient:', error)
      throw error
    }
  }
}