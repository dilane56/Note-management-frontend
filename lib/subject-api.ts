import { apiRequest } from './api'

export interface Subject {
  id: number
  name: string
  coefficient: number
  noteMaximale: number
  className: string
  teachers: Teacher[]
}

export interface Teacher {
  teacherFirstName: string
  teacherLastName: string
}

export interface SubjectRequest {
  name: string
  coefficient: number
  noteMaximale: number
  classId: number
}

export const subjectApi = {
  async getSubjects(token: string): Promise<Subject[]> {
    return apiRequest('/api/subjects', {}, token)
  },

  async getSubjectById(id: number, token: string): Promise<Subject> {
    return apiRequest(`/api/subjects/${id}`, {}, token)
  },

  async createSubject(data: SubjectRequest, token: string): Promise<Subject> {
    return apiRequest('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(data)
    }, token)
  },

  async updateSubject(id: number, data: SubjectRequest, token: string): Promise<Subject> {
    return apiRequest(`/api/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token)
  },

  async deleteSubject(id: number, token: string): Promise<string> {
    return apiRequest(`/api/subjects/${id}`, {
      method: 'DELETE'
    }, token)
  },

  async assignTeacher(teacherId: number, subjectId: number, token: string): Promise<Subject> {
    return apiRequest(`/api/teachers/${teacherId}/assign-subject/${subjectId}`, {
      method: 'PATCH'
    }, token)
  }
}