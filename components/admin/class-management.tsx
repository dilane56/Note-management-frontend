"use client"

import type React from "react"
import { useState } from "react"
import { Edit, Loader2, Plus, Search, Trash2, Users } from "lucide-react"
import { ConfirmDialog, ErrorState, SectionHeader, TableStateRow, useConfirmDelete } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useClasses } from "@/hooks/useClasses"
import { normalize } from "@/lib/format"
import type { SchoolClass } from "@/lib/types"

export function ClassManagement() {
  const { classes, filieres, loading, error, reload, createClass, updateClass, deleteClass } = useClasses()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SchoolClass | null>(null)
  const [className, setClassName] = useState("")
  const [filiereId, setFiliereId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentsOf, setStudentsOf] = useState<SchoolClass | null>(null)
  const confirmDelete = useConfirmDelete<SchoolClass>()

  const term = normalize(searchTerm)
  const filteredClasses = classes.filter(
    (c) => normalize(c.className).includes(term) || normalize(c.filiereName).includes(term),
  )

  const openCreate = () => {
    setEditing(null)
    setClassName("")
    setFiliereId("")
    setDialogOpen(true)
  }

  const openEdit = (schoolClass: SchoolClass) => {
    setEditing(schoolClass)
    setClassName(schoolClass.className)
    setFiliereId(schoolClass.filiereId ? String(schoolClass.filiereId) : "")
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!className.trim() || !filiereId) return
    const payload = { className: className.trim(), filiereId: Number(filiereId) }
    setIsSubmitting(true)
    const ok = editing ? await updateClass(editing.id, payload) : await createClass(payload)
    setIsSubmitting(false)
    if (ok) setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion des classes"
        description="Gérez les classes de l'établissement"
        actions={
          <Button onClick={openCreate} disabled={filieres.length === 0} title={filieres.length === 0 ? "Créez d'abord une filière" : undefined}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle classe
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={(open) => !isSubmitting && setDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la classe" : "Créer une classe"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifiez les informations de la classe" : "Ajoutez une nouvelle classe"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-name">Nom de la classe</Label>
              <Input
                id="class-name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex : Terminale S1, Première L2..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-filiere">Filière</Label>
              <Select value={filiereId} onValueChange={setFiliereId}>
                <SelectTrigger id="class-filiere" className="w-full">
                  <SelectValue placeholder="Sélectionner une filière" />
                </SelectTrigger>
                <SelectContent>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere.id} value={String(filiere.id)}>
                      {filiere.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || !className.trim() || !filiereId}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={studentsOf !== null} onOpenChange={(open) => !open && setStudentsOf(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Étudiants — {studentsOf?.className}</DialogTitle>
            <DialogDescription>{studentsOf?.students.length ?? 0} étudiant(s) inscrit(s)</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(studentsOf?.students.length ?? 0) === 0 ? (
                <TableStateRow colSpan={3} loading={false} emptyLabel="Aucun étudiant dans cette classe" />
              ) : (
                [...(studentsOf?.students ?? [])]
                  .sort((a, b) => a.studentLastName.localeCompare(b.studentLastName, "fr"))
                  .map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>
                        <Badge variant="outline">{student.studentMatricule || "-"}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{student.studentLastName}</TableCell>
                      <TableCell>{student.studentFirstName}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        {...confirmDelete.dialogProps}
        title="Supprimer la classe"
        description={`Supprimer la classe « ${confirmDelete.target?.className ?? ""} » ? Une classe qui contient des étudiants ou des matières ne peut pas être supprimée.`}
        onConfirm={() => confirmDelete.target && deleteClass(confirmDelete.target.id)}
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
            <Input
              placeholder="Rechercher une classe ou une filière..."
              aria-label="Rechercher une classe"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des classes ({filteredClasses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classe</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead className="w-36 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || filteredClasses.length === 0 ? (
                <TableStateRow colSpan={4} loading={loading} emptyLabel="Aucune classe trouvée" />
              ) : (
                filteredClasses.map((schoolClass) => (
                  <TableRow key={schoolClass.id}>
                    <TableCell className="font-medium">{schoolClass.className}</TableCell>
                    <TableCell>{schoolClass.filiereName}</TableCell>
                    <TableCell>{schoolClass.students.length}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStudentsOf(schoolClass)}
                        aria-label={`Voir les étudiants de ${schoolClass.className}`}
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(schoolClass)} aria-label={`Modifier ${schoolClass.className}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirmDelete.ask(schoolClass)}
                        aria-label={`Supprimer ${schoolClass.className}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
