import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { subjectApi, type Subject, type SubjectRequest } from '@/lib/subject-api'
import { classApi, type Class } from '@/lib/class-api'
import { userApi, type User } from '@/lib/user-api'
import { toast } from 'sonner'

export const useSubjects = () => {
  const { token } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const [subjectsData, classesData, teachersData] = await Promise.all([
        subjectApi.getSubjects(token),
        classApi.getClasses(token),
        userApi.getUsers(token).then(users => users.filter(u => u.role === 'TEACHER'))
      ])
      setSubjects(subjectsData)
      setClasses(classesData)
      setTeachers(teachersData)
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async (data: SubjectRequest) => {
    if (!token) return false

    try {
      const newSubject = await subjectApi.createSubject(data, token)
      setSubjects(prev => [...prev, newSubject])
      toast.success('Matière créée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la création')
      return false
    }
  }

  const updateSubject = async (id: number, data: SubjectRequest) => {
    if (!token) return false

    try {
      const updatedSubject = await subjectApi.updateSubject(id, data, token)
      setSubjects(prev => prev.map(s => s.id === id ? updatedSubject : s))
      toast.success('Matière modifiée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la modification')
      return false
    }
  }

  const deleteSubject = async (id: number) => {
    if (!token) return false

    try {
      await subjectApi.deleteSubject(id, token)
      setSubjects(prev => prev.filter(s => s.id !== id))
      toast.success('Matière supprimée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      return false
    }
  }

  const assignTeacher = async (teacherId: number, subjectId: number) => {
    if (!token) return false

    try {
      const updatedSubject = await subjectApi.assignTeacher(teacherId, subjectId, token)
      setSubjects(prev => prev.map(s => s.id === subjectId ? updatedSubject : s))
      toast.success('Enseignant assigné avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de l\'assignation')
      return false
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  return {
    subjects,
    classes,
    teachers,
    loading,
    createSubject,
    updateSubject,
    deleteSubject,
    assignTeacher,
    refetch: fetchData
  }
}