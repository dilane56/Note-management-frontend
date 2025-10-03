import { apiRequest } from './api'

export interface Stats {
  totalClasses: number
  totalStudents: number
  globalAverage: number
  sucessRate: number
}



export const StatsApi = {
  async getStats(token: string, teacherId : number): Promise<Stats[]> {
    return apiRequest(`/api/statistics/teacher/${teacherId}/dashboard`, {}, token)
  },

  
}