"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, type UserResponse, ApiError } from "@/lib/api"
import { toast } from "sonner"

type UserRole = "student" | "teacher" | "admin"

interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert backend role to frontend role
const mapRole = (backendRole: string): UserRole => {
  switch (backendRole) {
    case 'ADMIN': return 'admin'
    case 'STUDENT': return 'student'
    case 'TEACHER': return 'teacher'
    default: return 'student'
  }
}

// Helper function to convert backend user to frontend user
const mapUser = (backendUser: UserResponse): User => ({
  id: backendUser.id,
  name: `${backendUser.firstName} ${backendUser.lastName}`,
  email: backendUser.email,
  role: mapRole(backendUser.role)
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("eduGradesUser")
    const storedToken = localStorage.getItem("eduGradesToken")
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })
      const mappedUser = mapUser(response.user)
      
      setUser(mappedUser)
      setToken(response.token)
      
      // Store in localStorage
      localStorage.setItem("eduGradesUser", JSON.stringify(mappedUser))
      localStorage.setItem("eduGradesToken", response.token)
      
      toast.success(`Bienvenue ${mappedUser.name}!`)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof ApiError ? error.message : 'Erreur de connexion')
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("eduGradesUser")
    localStorage.removeItem("eduGradesToken")
    toast.info('Vous avez été déconnecté')
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, token }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
