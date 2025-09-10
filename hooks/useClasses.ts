import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { classApi, type Class, type ClassRequest } from '@/lib/class-api'
import { filiereApi, type Filiere } from '@/lib/filiere-api'
import { toast } from 'sonner'

export const useClasses = () => {
  const { token } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const [classesData, filieresData] = await Promise.all([
        classApi.getClasses(token),
        filiereApi.getFilieres(token)
      ])
      setClasses(classesData)
      setFilieres(filieresData)
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const createClass = async (data: ClassRequest) => {
    if (!token) return false

    try {
      const newClass = await classApi.createClass(data, token)
      setClasses(prev => [...prev, newClass])
      toast.success('Classe créée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la création')
      return false
    }
  }

  const updateClass = async (id: number, data: ClassRequest) => {
    if (!token) return false

    try {
      const updatedClass = await classApi.updateClass(id, data, token)
      setClasses(prev => prev.map(c => c.id === id ? updatedClass : c))
      toast.success('Classe modifiée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la modification')
      return false
    }
  }

  const deleteClass = async (id: number) => {
    if (!token) return false

    try {
      await classApi.deleteClass(id, token)
      setClasses(prev => prev.filter(c => c.id !== id))
      toast.success('Classe supprimée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      return false
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  return {
    classes,
    filieres,
    loading,
    createClass,
    updateClass,
    deleteClass,
    refetch: fetchData
  }
}