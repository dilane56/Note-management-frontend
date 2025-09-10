import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { userApi, type User, type CreateUserRequest, type UpdateUserRequest } from '@/lib/user-api'
import { classApi, type Class } from '@/lib/class-api'
import { toast } from 'sonner'

// Helper function to normalize user data from backend
const normalizeUser = (user: any): User => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  password: user.password,
  role: user.role || 'STUDENT'
})

const normalizeUsers = (users: any[]): User[] => {
  return users.map(normalizeUser)
}

export const useUsers = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const [usersData, classesData] = await Promise.all([
        userApi.getUsers(token),
        classApi.getClasses(token)
      ])
      
      console.log('Backend response:', usersData)
      
      const normalizedUsers = normalizeUsers(usersData)
      console.log('Normalized users:', normalizedUsers)
      
      setUsers(normalizedUsers)
      setClasses(classesData)
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: CreateUserRequest & { studentClassId?: number }) => {
    if (!token) return false

    try {
      let newUser: User
      
      if (userData.role === 'ADMIN') {
        newUser = await userApi.createAdmin(userData, token)
      } else if (userData.role === 'STUDENT' && userData.studentClassId) {
        newUser = await userApi.createStudent({ ...userData, studentClassId: userData.studentClassId }, token)
      } else if (userData.role === 'TEACHER') {
        newUser = await userApi.createTeacher(userData, token)
      } else {
        throw new Error('Données invalides')
      }

      const normalized = normalizeUser(newUser)
      setUsers(prev => [...prev, normalized])
      toast.success('Utilisateur créé avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la création')
      return false
    }
  }

  const updateUser = async (id: number, userData: UpdateUserRequest & { studentClassId?: number }) => {
    if (!token) return false

    try {
      let updatedUser: User
      
      if (userData.role === 'ADMIN') {
        updatedUser = await userApi.updateAdmin(id, userData, token)
      } else if (userData.role === 'STUDENT' && userData.studentClassId) {
        updatedUser = await userApi.updateStudent(id, { ...userData, studentClassId: userData.studentClassId }, token)
      } else if (userData.role === 'TEACHER') {
        updatedUser = await userApi.updateTeacher(id, userData, token)
      } else {
        throw new Error('Données invalides')
      }

      const normalized = normalizeUser(updatedUser)
      setUsers(prev => prev.map(user => user.id === id ? normalized : user))
      toast.success('Utilisateur modifié avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la modification')
      return false
    }
  }

  const deleteUser = async (id: number) => {
    if (!token) return false

    try {
      await userApi.deleteUser(id, token)
      setUsers(prev => prev.filter(user => user.id !== id))
      toast.success('Utilisateur supprimé avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      return false
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  return {
    users,
    classes,
    loading,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  }
}