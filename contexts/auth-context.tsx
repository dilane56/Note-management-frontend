"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { authApi } from "@/lib/auth-api"
import { ApiError, getErrorMessage, TOKEN_STORAGE_KEY, UNAUTHORIZED_EVENT, USER_STORAGE_KEY } from "@/lib/api"
import type { Role, UserResponse } from "@/lib/types"

export type UserRole = "student" | "teacher" | "admin"

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginResult {
  success: boolean
  message?: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  /** true pendant la restauration de la session au démarrage. */
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: (showMessage?: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ROLE_MAP: Record<Role, UserRole> = { ADMIN: "admin", TEACHER: "teacher", STUDENT: "student" }

const mapUser = (backendUser: UserResponse): AuthUser => ({
  id: backendUser.id,
  name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
  email: backendUser.email,
  role: ROLE_MAP[backendUser.role],
})

const clearStorage = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    /* stockage indisponible : rien à nettoyer */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Évite d'afficher plusieurs fois « session expirée » quand plusieurs requêtes échouent en même temps.
  const sessionActive = useRef(false)

  const logout = useCallback((showMessage = true) => {
    sessionActive.current = false
    setUser(null)
    setToken(null)
    clearStorage()
    if (showMessage) toast.info("Vous avez été déconnecté")
  }, [])

  // Restauration de la session : le token stocké est vérifié auprès du backend.
  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      let storedUser: AuthUser | null = null
      let storedToken: string | null = null
      try {
        storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
        const rawUser = localStorage.getItem(USER_STORAGE_KEY)
        storedUser = rawUser ? (JSON.parse(rawUser) as AuthUser) : null
      } catch {
        clearStorage()
      }

      if (storedToken && storedUser) {
        try {
          const info = await authApi.validateToken()
          if (!cancelled) {
            const role = ROLE_MAP[info.role] ?? storedUser.role
            const restored = { ...storedUser, id: info.id ?? storedUser.id, role }
            sessionActive.current = true
            setUser(restored)
            setToken(storedToken)
          }
        } catch (error) {
          if (error instanceof ApiError && error.status === 0) {
            // Serveur injoignable : on garde la session, les écrans afficheront l'erreur réseau.
            if (!cancelled) {
              sessionActive.current = true
              setUser(storedUser)
              setToken(storedToken)
            }
          } else {
            clearStorage()
          }
        }
      }
      if (!cancelled) setIsLoading(false)
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  // Toute requête authentifiée qui reçoit un 401 ferme la session.
  useEffect(() => {
    const onUnauthorized = () => {
      if (!sessionActive.current) return
      logout(false)
      toast.error("Votre session a expiré. Veuillez vous reconnecter.")
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [logout])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await authApi.login({ email: email.trim(), password })
      const mappedUser = mapUser(response.user)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser))
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
      sessionActive.current = true
      setUser(mappedUser)
      setToken(response.token)
      toast.success(`Bienvenue ${mappedUser.name} !`)
      return { success: true }
    } catch (error) {
      // Message du backend : identifiants invalides (401) ou compte temporairement bloqué (429).
      return { success: false, message: getErrorMessage(error, "Erreur de connexion") }
    }
  }

  return <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
