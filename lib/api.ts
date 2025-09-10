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

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }
}