"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { ClassSelect } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { roleLabel } from "@/lib/format"
import type { Role, SchoolClass, StudentPayload, UserPayload } from "@/lib/types"

export interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  role: Role
  studentClassId?: number
  matricule?: string | null
}

interface UserFormProps {
  /** Valeurs initiales ; leur présence active le mode modification. */
  initialData?: UserFormValues
  classes: SchoolClass[]
  onSubmit: (role: Role, payload: UserPayload | StudentPayload) => Promise<boolean>
}

const MIN_PASSWORD_LENGTH = 6
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function UserForm({ initialData, classes, onSubmit }: UserFormProps) {
  const isEditing = !!initialData
  const [firstName, setFirstName] = useState(initialData?.firstName ?? "")
  const [lastName, setLastName] = useState(initialData?.lastName ?? "")
  const [email, setEmail] = useState(initialData?.email ?? "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(initialData?.role ?? "STUDENT")
  const [classId, setClassId] = useState(initialData?.studentClassId ? String(initialData.studentClassId) : "")
  const [matricule, setMatricule] = useState(initialData?.matricule ?? "")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errors = {
    firstName: !firstName.trim() ? "Le prénom est obligatoire" : "",
    lastName: !lastName.trim() ? "Le nom est obligatoire" : "",
    email: !EMAIL_PATTERN.test(email.trim()) ? "Adresse email invalide" : "",
    password:
      !isEditing && !password
        ? "Le mot de passe est obligatoire"
        : password && password.length < MIN_PASSWORD_LENGTH
          ? `Au moins ${MIN_PASSWORD_LENGTH} caractères`
          : "",
    classId: role === "STUDENT" && !classId ? "La classe est obligatoire" : "",
  }
  const hasErrors = Object.values(errors).some(Boolean)
  const show = (field: keyof typeof errors) => (submitted ? errors[field] : "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors) return

    const payload: UserPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      // En modification, un mot de passe vide conserve le mot de passe actuel.
      ...(password ? { password } : {}),
    }
    const finalPayload: UserPayload | StudentPayload =
      role === "STUDENT"
        ? { ...payload, studentClassId: Number(classId), ...(matricule.trim() ? { matricule: matricule.trim() } : {}) }
        : payload

    setIsSubmitting(true)
    try {
      await onSubmit(role, finalPayload)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldError = (field: keyof typeof errors) =>
    show(field) ? (
      <p id={`${field}-error`} className="text-sm text-destructive">
        {show(field)}
      </p>
    ) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} aria-invalid={!!show("firstName")} />
          {fieldError("firstName")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} aria-invalid={!!show("lastName")} />
          {fieldError("lastName")}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!show("email")}
        />
        {fieldError("email")}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{isEditing ? "Nouveau mot de passe" : "Mot de passe"}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEditing ? "Laisser vide pour conserver le mot de passe actuel" : ""}
          aria-invalid={!!show("password")}
        />
        {fieldError("password") ?? (
          <p className="text-xs text-muted-foreground">Au moins {MIN_PASSWORD_LENGTH} caractères.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        {isEditing ? (
          <>
            <Input id="role" value={roleLabel(role)} disabled />
            <p className="text-xs text-muted-foreground">
              Le rôle ne peut pas être modifié : supprimez le compte et recréez-le si nécessaire.
            </p>
          </>
        ) : (
          <Select value={role} onValueChange={(value) => setRole(value as Role)}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STUDENT">Étudiant</SelectItem>
              <SelectItem value="TEACHER">Enseignant</SelectItem>
              <SelectItem value="ADMIN">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {role === "STUDENT" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentClass">Classe</Label>
            <ClassSelect id="studentClass" classes={classes} value={classId} onChange={setClassId} />
            {fieldError("classId")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input
              id="matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder={isEditing ? "" : "Généré automatiquement"}
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isEditing ? "Enregistrer" : "Créer le compte"}
      </Button>
    </form>
  )
}
