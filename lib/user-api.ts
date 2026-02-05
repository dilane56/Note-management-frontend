import { apiRequest } from './api'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  password?: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
}

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
}

export const userApi = {
  async getUsers(token: string): Promise<User[]> {
    return apiRequest('/api/users', {}, token)
  },

  async createAdmin(data: CreateUserRequest, token: string): Promise<User> {
    return apiRequest('/api/v1/admins', {
      method: 'POST',
      body: JSON.stringify(data)
    }, token)
  },

  async createStudent(data: CreateUserRequest & { studentClassId: number }, token: string): Promise<User> {
    return apiRequest('/api/students', {
      method: 'POST',
      body: JSON.stringify(data)
    }, token)
  },

  async createTeacher(data: CreateUserRequest, token: string): Promise<User> {
    return apiRequest('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(data)
    }, token)
  },

  async updateAdmin(id: number, data: UpdateUserRequest, token: string): Promise<User> {
    return apiRequest(`/api/v1/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token)
  },

  async updateStudent(id: number, data: UpdateUserRequest & { studentClassId: number }, token: string): Promise<User> {
    return apiRequest(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token)
  },

  async updateTeacher(id: number, data: UpdateUserRequest, token: string): Promise<User> {
    return apiRequest(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token)
  },

  async deleteUser(id: number, token: string): Promise<string> {
    return apiRequest(`/api/users/${id}`, {
      method: 'DELETE'
    }, token)
  }
}