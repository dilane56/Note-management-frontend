"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, Edit, Loader2, Plus, Search, Trash2, UserPlus } from "lucide-react"
import { ClassSelect, ConfirmDialog, ErrorState, SectionHeader, TableStateRow, useConfirmDelete } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSubjects } from "@/hooks/useSubjects"
import { fullName, normalize } from "@/lib/format"
import type { Subject } from "@/lib/types"

interface SubjectForm {
  name: string
  coefficient: string
  noteMaximale: string
  classId: string
}

const EMPTY_FORM: SubjectForm = { name: "", coefficient: "1", noteMaximale: "20", classId: "" }

export function SubjectManagement() {
  const { subjects, classes, teachers, loading, error, reload, createSubject, updateSubject, deleteSubject, assignTeacher } =
    useSubjects()
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [form, setForm] = useState<SubjectForm>(EMPTY_FORM)
  const [assigning, setAssigning] = useState<Subject | null>(null)
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmDelete = useConfirmDelete<Subject>()

  const coefficient = Number(form.coefficient.replace(",", "."))
  const noteMaximale = Number(form.noteMaximale)
  const formErrors = {
    coefficient: !(coefficient > 0) ? "Le coefficient doit être supérieur à 0" : "",
    noteMaximale: !(Number.isInteger(noteMaximale) && noteMaximale > 0) ? "La note maximale doit être un entier positif" : "",
  }
  const formValid = form.name.trim() && form.classId && !formErrors.coefficient && !formErrors.noteMaximale

  const term = normalize(searchTerm)
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = normalize(subject.name).includes(term)
    const matchesClass = classFilter === "all" || String(subject.classId) === classFilter
    return matchesSearch && matchesClass
  })

  const assignableTeachers = assigning
    ? teachers.filter((t) => !assigning.teachers.some((assigned) => assigned.teacherId === t.id))
    : []

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (subject: Subject) => {
    setEditing(subject)
    setForm({
      name: subject.name,
      coefficient: String(subject.coefficient),
      noteMaximale: String(subject.noteMaximale),
      classId: subject.classId ? String(subject.classId) : "",
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid) return
    const payload = { name: form.name.trim(), coefficient, noteMaximale, classId: Number(form.classId) }
    setIsSubmitting(true)
    const ok = editing ? await updateSubject(editing.id, payload) : await createSubject(payload)
    setIsSubmitting(false)
    if (ok) setDialogOpen(false)
  }

  const handleAssignTeacher = async () => {
    if (!assigning || !selectedTeacherId) return
    setIsSubmitting(true)
    const ok = await assignTeacher(Number(selectedTeacherId), assigning.id)
    setIsSubmitting(false)
    if (ok) {
      setAssigning(null)
      setSelectedTeacherId("")
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion des matières"
        description="Matières par classe, coefficients et enseignants"
        actions={
          <Button onClick={openCreate} disabled={classes.length === 0} title={classes.length === 0 ? "Créez d'abord une classe" : undefined}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle matière
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={(open) => !isSubmitting && setDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la matière" : "Créer une matière"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifiez les informations de la matière" : "Ajoutez une matière au programme d'une classe"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Nom de la matière</Label>
              <Input
                id="subject-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Mathématiques, Physique..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject-coefficient">Coefficient</Label>
                <Input
                  id="subject-coefficient"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={form.coefficient}
                  onChange={(e) => setForm((f) => ({ ...f, coefficient: e.target.value }))}
                  aria-invalid={!!formErrors.coefficient}
                  required
                />
                {formErrors.coefficient && <p className="text-sm text-destructive">{formErrors.coefficient}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-max">Note maximale</Label>
                <Input
                  id="subject-max"
                  type="number"
                  min="1"
                  step="1"
                  value={form.noteMaximale}
                  onChange={(e) => setForm((f) => ({ ...f, noteMaximale: e.target.value }))}
                  aria-invalid={!!formErrors.noteMaximale}
                  required
                />
                {formErrors.noteMaximale && <p className="text-sm text-destructive">{formErrors.noteMaximale}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-class">Classe</Label>
              <ClassSelect
                id="subject-class"
                classes={classes}
                value={form.classId}
                onChange={(value) => setForm((f) => ({ ...f, classId: value }))}
              />
            </div>
            {editing && (
              <p className="text-sm text-muted-foreground">
                Modifier le coefficient ou la note maximale recalcule les moyennes de la classe.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting || !formValid}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Enregistrer" : "Créer la matière"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={assigning !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setAssigning(null)
            setSelectedTeacherId("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un enseignant</DialogTitle>
            <DialogDescription>
              Matière « {assigning?.name} » ({assigning?.className})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {assigning && assigning.teachers.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Déjà assignés :</p>
                <div className="flex flex-wrap gap-1">
                  {assigning.teachers.map((t) => (
                    <Badge key={t.teacherId} variant="secondary">
                      {t.teacherFirstName} {t.teacherLastName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="assign-teacher">Enseignant à ajouter</Label>
              <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                <SelectTrigger id="assign-teacher" className="w-full">
                  <SelectValue
                    placeholder={assignableTeachers.length ? "Sélectionner un enseignant" : "Aucun autre enseignant disponible"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assignableTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={String(teacher.id)}>
                      {fullName(teacher)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignTeacher} className="w-full" disabled={!selectedTeacherId || isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Assigner
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        {...confirmDelete.dialogProps}
        title="Supprimer la matière"
        description={`Supprimer la matière « ${confirmDelete.target?.name ?? ""} » (${confirmDelete.target?.className ?? ""}) ? Une matière qui a déjà des notes ne peut pas être supprimée.`}
        onConfirm={() => confirmDelete.target && deleteSubject(confirmDelete.target.id)}
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Rechercher une matière..."
                aria-label="Rechercher une matière"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-64">
              <ClassSelect classes={classes} value={classFilter} onChange={setClassFilter} includeAll />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des matières ({filteredSubjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Note max</TableHead>
                <TableHead>Enseignants</TableHead>
                <TableHead className="w-36 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || filteredSubjects.length === 0 ? (
                <TableStateRow colSpan={6} loading={loading} emptyLabel="Aucune matière trouvée" />
              ) : (
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" aria-hidden />
                        <span>{subject.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{subject.className || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.coefficient}</Badge>
                    </TableCell>
                    <TableCell>{subject.noteMaximale}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subject.teachers.length === 0 ? (
                          <span className="text-sm text-amber-600">Aucun</span>
                        ) : (
                          subject.teachers.map((teacher) => (
                            <Badge key={teacher.teacherId} variant="secondary" className="text-xs">
                              {teacher.teacherFirstName} {teacher.teacherLastName}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAssigning(subject)}
                        aria-label={`Assigner un enseignant à ${subject.name}`}
                        title="Assigner un enseignant"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(subject)} aria-label={`Modifier ${subject.name}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirmDelete.ask(subject)}
                        aria-label={`Supprimer ${subject.name}`}
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
