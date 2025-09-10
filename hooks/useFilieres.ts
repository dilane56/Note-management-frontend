import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { filiereApi, type Filiere, type FiliereRequest } from '@/lib/filiere-api'
import { toast } from 'sonner'

export const useFilieres = () => {
  const { token } = useAuth()
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFilieres = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const data = await filiereApi.getFilieres(token)
      setFilieres(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des filières')
    } finally {
      setLoading(false)
    }
  }

  const createFiliere = async (data: FiliereRequest) => {
    if (!token) return false

    try {
      const newFiliere = await filiereApi.createFiliere(data, token)
      setFilieres(prev => [...prev, newFiliere])
      toast.success('Filière créée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la création')
      return false
    }
  }

  const updateFiliere = async (id: number, data: FiliereRequest) => {
    if (!token) return false

    try {
      const updatedFiliere = await filiereApi.updateFiliere(id, data, token)
      setFilieres(prev => prev.map(f => f.id === id ? updatedFiliere : f))
      toast.success('Filière modifiée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la modification')
      return false
    }
  }

  const deleteFiliere = async (id: number) => {
    if (!token) return false

    try {
      await filiereApi.deleteFiliere(id, token)
      setFilieres(prev => prev.filter(f => f.id !== id))
      toast.success('Filière supprimée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      return false
    }
  }

  useEffect(() => {
    fetchFilieres()
  }, [token])

  return {
    filieres,
    loading,
    createFiliere,
    updateFiliere,
    deleteFiliere,
    refetch: fetchFilieres
  }
}