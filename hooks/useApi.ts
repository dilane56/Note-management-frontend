import { useAuth } from '@/contexts/auth-context'
import { apiRequest, ApiError } from '@/lib/api'
import { toast } from 'sonner'

export const useApi = () => {
  const { token } = useAuth()

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      return await apiRequest(endpoint, options, token || undefined)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Erreur API')
      throw error
    }
  }

  return { makeRequest }
}