"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Class } from "@/lib/class-api"

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
  studentClassId?: number
}

interface UserFormProps {
  initialData?: Partial<UserFormData>
  classes: Class[]
  onSubmit: (data: UserFormData) => Promise<boolean>
  isEditing?: boolean
}

export function UserForm({ initialData, classes, onSubmit, isEditing = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    ...initialData
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">Prénom</Label>
        <Input 
          id="firstName" 
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="lastName">Nom</Label>
        <Input 
          id="lastName" 
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          required 
        />
      </div>
      
      {!isEditing && (
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input 
            id="password" 
            type="password" 
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            required 
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value: any) => updateField('role', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Étudiant</SelectItem>
            <SelectItem value="TEACHER">Enseignant</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.role === 'STUDENT' && (
        <div>
          <Label htmlFor="studentClass">Classe</Label>
          <Select 
            value={formData.studentClassId?.toString()} 
            onValueChange={(value) => updateField('studentClassId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.className} - {cls.filiereName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          isEditing ? 'Modifier' : 'Créer le Compte'
        )}
      </Button>
    </form>
  )
}