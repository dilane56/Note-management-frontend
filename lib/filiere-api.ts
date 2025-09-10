import { apiRequest } from './api'

export interface Filiere {
  id: number
  name: string
}

export interface FiliereRequest {
  name: string
}

export const filiereApi = {
  async getFilieres(token: string): Promise<Filiere[]> {
    return apiRequest('/api/filieres', {}, token)
  },

  async getFiliereById(id: number, token: string): Promise<Filiere> {
    return apiRequest(`/api/filieres/${id}`, {}, token)
  },

  async createFiliere(data: FiliereRequest, token: string): Promise<Filiere> {
    return apiRequest('/api/filieres', {
      method: 'POST',
      body: JSON.stringify(data)
    }, token)
  },

  async updateFiliere(id: number, data: FiliereRequest, token: string): Promise<Filiere> {
    return apiRequest(`/api/filieres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token)
  },

  async deleteFiliere(id: number, token: string): Promise<string> {
    return apiRequest(`/api/filieres/${id}`, {
      method: 'DELETE'
    }, token)
  }
}