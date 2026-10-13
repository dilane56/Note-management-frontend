"use client"

import { useState } from "react"
import { Edit, Loader2, Search, Trash2, UserPlus } from "lucide-react"
import { ConfirmDialog, ErrorState, SectionHeader, TableStateRow, useConfirmDelete } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { runAction } from "@/hooks/useAsync"
import { useUsers } from "@/hooks/useUsers"
import { fullName, normalize, roleLabel } from "@/lib/format"
import type { Role, StudentPayload, UserPayload, UserResponse } from "@/lib/types"
import { userApi } from "@/lib/user-api"
import { UserForm, type UserFormValues } from "./user-form"

type DialogState = { mode: "create" } | { mode: "edit"; user: UserResponse; values: UserFormValues } | null

export function UserManagement() {
  const { user: currentUser } = useAuth()
  const { users, classes, loading, error, reload, createUser, updateUser, deleteUser } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all")
  const [dialog, setDialog] = useState<DialogState>(null)
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null)
  const confirmDelete = useConfirmDelete<UserResponse>()

  const term = normalize(searchTerm)
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch = normalize(fullName(user)).includes(term) || normalize(user.email).includes(term)
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
    .sort((a, b) => a.lastName.localeCompare(b.lastName, "fr") || a.firstName.localeCompare(b.firstName, "fr"))

  const handleEdit = async (user: UserResponse) => {
    const values: UserFormValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }
    if (user.role === "STUDENT") {
      // La liste des utilisateurs ne contient pas la classe : on la récupère avant d'ouvrir le formulaire.
      setLoadingEditId(user.id)
      const { ok, result } = await runAction(() => userApi.getStudent(user.id), undefined, "Impossible de charger l'étudiant")
      setLoadingEditId(null)
      if (!ok || !result) return
      values.studentClassId = result.studentClass?.classId
      values.matricule = result.matricule
    }
    setDialog({ mode: "edit", user, values })
  }

  const handleSubmit = async (role: Role, payload: UserPayload | StudentPayload) => {
    const ok =
      dialog?.mode === "edit" ? await updateUser(role, dialog.user.id, payload) : await createUser(role, payload)
    if (ok) setDialog(null)
    return ok
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion des utilisateurs"
        description="Comptes étudiants, enseignants et administrateurs"
        actions={
          <Button onClick={() => setDialog({ mode: "create" })}>
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        }
      />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialog?.mode === "edit" ? "Modifier l'utilisateur" : "Créer un utilisateur"}</DialogTitle>
            <DialogDescription>
              {dialog?.mode === "edit"
                ? `${fullName(dialog.user)} — ${roleLabel(dialog.user.role)}`
                : "Ajoutez un étudiant, un enseignant ou un administrateur"}
            </DialogDescription>
          </DialogHeader>
          {dialog && (
            <UserForm
              key={dialog.mode === "edit" ? dialog.user.id : "new"}
              initialData={dialog.mode === "edit" ? dialog.values : undefined}
              classes={classes}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        {...confirmDelete.dialogProps}
        title="Supprimer l'utilisateur"
        description={
          confirmDelete.target?.role === "STUDENT"
            ? `Supprimer ${fullName(confirmDelete.target)} ? Ses notes et relevés seront définitivement supprimés.`
            : `Supprimer ${fullName(confirmDelete.target)} ? Cette action est définitive.`
        }
        onConfirm={() => confirmDelete.target && deleteUser(confirmDelete.target.id)}
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Rechercher par nom ou email..."
                aria-label="Rechercher un utilisateur"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as "all" | Role)}>
              <SelectTrigger className="sm:w-48" aria-label="Filtrer par rôle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="STUDENT">Étudiants</SelectItem>
                <SelectItem value="TEACHER">Enseignants</SelectItem>
                <SelectItem value="ADMIN">Administrateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || filteredUsers.length === 0 ? (
                <TableStateRow colSpan={4} loading={loading} emptyLabel="Aucun utilisateur trouvé" />
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentUser?.id
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {fullName(user)}
                        {isSelf && <span className="ml-2 text-xs text-muted-foreground">(vous)</span>}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleLabel(user.role)}</Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          disabled={loadingEditId === user.id}
                          aria-label={`Modifier ${fullName(user)}`}
                        >
                          {loadingEditId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => confirmDelete.ask(user)}
                          disabled={isSelf}
                          title={isSelf ? "Vous ne pouvez pas supprimer votre propre compte" : undefined}
                          aria-label={`Supprimer ${fullName(user)}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
