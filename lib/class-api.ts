import { apiRequest } from './api'

export interface Class {
  id: number
  className: string
  filiereName: string
  students?: any[]
}

export interface ClassResponseDTO {
  id: number
  className: string
  filiereId: number
  filiereName: string
  students: {
    studentId: number
    studentFirstName: string
    studentLastName: string
    studentMatricule: string | null
  }[]
}

export interface ClassRequest {
  className: string
  filiereId: number
}

export const classApi = {
  async getClasses(token: string): Promise<Class[]> {
    return apiRequest('/api/classes', {}, token)
  },

  async getClassById(id: number, token: string): Promise<Class> {
    return apiRequest(`/api/classes/${id}`, {}, token)
  },

  async createClass(data: ClassRequest, token: string): Promise<Class> {
    return apiRequest('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data)
    }, token)
  },

  async updateClass(id: number, data: ClassRequest, token: string): Promise<Class> {
    return apiRequest(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token)
  },

  async deleteClass(id: number, token: string): Promise<string> {
    return apiRequest(`/api/classes/${id}`, {
      method: 'DELETE'
    }, token)
  }
}