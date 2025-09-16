import { useState, useEffect } from 'react'
import { teacherSubjectApi, TeacherSubject } from '@/lib/teacher-subject-api'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

export function useTeacherSubjects() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<TeacherSubject[]>([])
  const [loading, setLoading] = useState(true)

  const loadSubjects = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const data = await teacherSubjectApi.getMySubjects(user.id)
      setSubjects(data)
    } catch (error) {
      console.error('Error loading subjects:', error)
      if (error instanceof Error && error.message.includes('401')) {
        toast.error('Session expirée. Veuillez vous reconnecter.')
      } else {
        toast.error('Erreur lors du chargement des matières')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateCoefficient = async (subjectId: number, coefficient: number) => {
    try {
      await teacherSubjectApi.updateSubjectCoefficient(subjectId, coefficient)
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId ? { ...subject, coefficient } : subject
      ))
      toast.success('Coefficient mis à jour avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du coefficient')
      return false
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadSubjects()
    }
  }, [user?.id])

  return {
    subjects,
    loading,
    updateCoefficient,
    refreshSubjects: loadSubjects,
    fetchTeacherSubjects: loadSubjects
  }
}