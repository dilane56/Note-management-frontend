const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
}

export interface LoginResponse {
  token: string
  user: UserResponse
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// Helper function for authenticated requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || 'Une erreur est survenue')
  }

  return response.json()
}

// API instance with automatic token management
const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('eduGradesToken')
    if (!token) {
      throw new ApiError(401, 'Token d\'authentification manquant')
    }
    return apiRequest(endpoint, { method: 'GET' }, token)
  },
  
  post: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem('eduGradesToken')
    return apiRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, token || undefined)
  },
  
  put: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem('eduGradesToken')
    if (!token) {
      throw new ApiError(401, 'Token d\'authentification manquant')
    }
    return apiRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, token)
  },
  
  delete: async (endpoint: string) => {
    const token = localStorage.getItem('eduGradesToken')
    return apiRequest(endpoint, { method: 'DELETE' }, token || undefined)
  },

  patch: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem('eduGradesToken')
    if (!token) {
      throw new ApiError(401, 'Token d\'authentification manquant')
    }
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, token)
  },
  
}

export { api };
// Grade interfaces
export interface GradeRequestDTO {
  studentID: number
  SubjectID: number
  evaluationId: number
  noteValue: number
  comment?: string
}

export interface TeacherGradeRequestDTO {
  noteValue: number
  evaluationId: number
  comment?: string
}

export interface GradeResponseDTO {
  id: number
  gradeValue: number
  comment?: string
  createdAt: string
  updatedAt: string
  student: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  subject: {
    id: number
    name: string
    coefficient: number
  }
  evaluation: {
    id: number
    name: string
    typeEvaluation: string
  }
}

export interface StudentResponseDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  matricule: string
}

export interface EvaluationResponseDTO {
  Id: number
  anneeAcademique: string
  typeEvaluation: string
}