"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BookOpen, Edit, Loader2, MessageSquare, Plus, Search, Trash2, Users } from "lucide-react"
import { ConfirmDialog, ErrorState, EvaluationSelect, SectionHeader, TableStateRow, useConfirmDelete } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { runAction, useAsync } from "@/hooks/useAsync"
import { useEvaluations } from "@/hooks/useEvaluations"
import { gradeApi } from "@/lib/grade-api"
import { evaluationLabel, formatOn20, formatRawGrade, fullName, gradeVariant, normalize, toTwenty } from "@/lib/format"
import { teacherApi } from "@/lib/teacher-api"
import type { NoteInStudent, StudentResponse, Subject } from "@/lib/types"

/** Commentaire par défaut posé par le backend quand aucun commentaire n'est saisi. */
const DEFAULT_COMMENT = "RAS"

type GradeDialog = { student: StudentResponse; note: NoteInStudent | null } | null

export function GradeEntry() {
  const { user } = useAuth()
  const { evaluations } = useEvaluations()
  const [selectedSubjectId, setSelectedSubjectId] = useState("")
  const [selectedEvaluation, setSelectedEvaluation] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeDialog, setGradeDialog] = useState<GradeDialog>(null)
  const [gradeValue, setGradeValue] = useState("")
  const [comment, setComment] = useState("")
  const [commenting, setCommenting] = useState<{ student: StudentResponse; note: NoteInStudent } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmDelete = useConfirmDelete<{ student: StudentResponse; note: NoteInStudent }>()

  const subjects = useAsync<Subject[]>(() => teacherApi.getSubjects(user!.id), [user?.id], [], !!user?.id)
  const subjectId = Number(selectedSubjectId)
  const evaluationId = Number(selectedEvaluation)
  const subject = subjects.data.find((s) => s.id === subjectId)
  const noteMaximale = subject?.noteMaximale || 20

  const students = useAsync<StudentResponse[]>(
    () => gradeApi.getStudentsBySubject(subjectId),
    [subjectId],
    [],
    subjectId > 0,
  )

  // Valeurs par défaut : première matière et évaluation la plus récente.
  useEffect(() => {
    if (!selectedSubjectId && subjects.data.length === 1) setSelectedSubjectId(String(subjects.data[0].id))
  }, [subjects.data, selectedSubjectId])
  useEffect(() => {
    if (!selectedEvaluation && evaluations.length > 0) setSelectedEvaluation(String(evaluations[0].id))
  }, [evaluations, selectedEvaluation])

  const noteFor = (student: StudentResponse) =>
    student.notes?.find((note) => note.subjectId === subjectId && note.evaluationReponse?.id === evaluationId) ?? null

  const term = normalize(searchTerm)
  const filteredStudents = students.data
    .filter((s) => normalize(fullName(s)).includes(term) || normalize(s.matricule).includes(term))
    .sort((a, b) => a.lastName.localeCompare(b.lastName, "fr") || a.firstName.localeCompare(b.firstName, "fr"))
  const gradedCount = students.data.filter((s) => noteFor(s)).length

  const parsedValue = Number(gradeValue.replace(",", "."))
  const valueError =
    gradeValue.trim() === ""
      ? ""
      : !Number.isFinite(parsedValue) || parsedValue < 0
        ? "La note doit être un nombre positif"
        : parsedValue > noteMaximale
          ? `La note ne doit pas dépasser ${noteMaximale}`
          : ""

  const openGradeDialog = (student: StudentResponse) => {
    const note = noteFor(student)
    setGradeDialog({ student, note })
    setGradeValue(note ? String(note.noteValue) : "")
    setComment(note?.comment && note.comment !== DEFAULT_COMMENT ? note.comment : "")
  }

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gradeDialog || gradeValue.trim() === "" || valueError) return
    const payload = {
      studentId: gradeDialog.student.id,
      subjectId,
      evaluationId,
      noteValue: parsedValue,
      ...(comment.trim() ? { comment: comment.trim() } : {}),
    }
    setIsSubmitting(true)
    const { ok } = await runAction(
      () => (gradeDialog.note ? gradeApi.update(gradeDialog.note.noteId, payload) : gradeApi.create(payload)),
      gradeDialog.note ? "Note modifiée" : "Note enregistrée",
      "Erreur lors de l'enregistrement de la note",
    )
    setIsSubmitting(false)
    if (ok) {
      setGradeDialog(null)
      await students.reload()
    }
  }

  const handleSaveComment = async () => {
    if (!commenting) return
    setIsSubmitting(true)
    const { ok } = await runAction(
      () => gradeApi.updateComment(commenting.note.noteId, comment.trim()),
      "Commentaire enregistré",
      "Erreur lors de l'enregistrement du commentaire",
    )
    setIsSubmitting(false)
    if (ok) {
      setCommenting(null)
      await students.reload()
    }
  }

  const ready = subjectId > 0 && evaluationId > 0

  return (
    <div className="space-y-6">
      <SectionHeader title="Saisie des notes" description="Choisissez une matière et une évaluation, puis notez vos étudiants" />

      {subjects.error && <ErrorState message={subjects.error} onRetry={subjects.reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade-subject">Matière *</Label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger id="grade-subject" className="w-full">
                  <SelectValue placeholder={subjects.loading ? "Chargement..." : "Choisir une matière"} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.data.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name} — {s.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade-evaluation">Évaluation *</Label>
              <EvaluationSelect
                id="grade-evaluation"
                evaluations={evaluations}
                value={selectedEvaluation}
                onChange={setSelectedEvaluation}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade-search">Rechercher un étudiant</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
                <Input
                  id="grade-search"
                  placeholder="Nom ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!subjects.loading && subjects.data.length === 0 && !subjects.error && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune matière ne vous est assignée. Contactez l&apos;administration.
          </CardContent>
        </Card>
      )}

      {evaluations.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune évaluation n&apos;a encore été créée par l&apos;administration.
          </CardContent>
        </Card>
      )}

      {ready && subject ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" aria-hidden />
              {subject.name} — {subject.className}
            </CardTitle>
            <CardDescription>
              {evaluationLabel(evaluations.find((e) => e.id === evaluationId))} · notes sur {noteMaximale} · coefficient{" "}
              {subject.coefficient} · {gradedCount}/{students.data.length} étudiant(s) noté(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.error ? (
              <ErrorState message={students.error} onRetry={students.reload} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="hidden lg:table-cell">Commentaire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.loading || filteredStudents.length === 0 ? (
                    <TableStateRow
                      colSpan={5}
                      loading={students.loading}
                      emptyLabel={searchTerm ? "Aucun étudiant ne correspond à la recherche" : "Aucun étudiant dans cette classe"}
                    />
                  ) : (
                    filteredStudents.map((student) => {
                      const note = noteFor(student)
                      const on20 = note ? toTwenty(note.noteValue, noteMaximale) : 0
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Badge variant="outline">{student.matricule || "-"}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{fullName(student)}</TableCell>
                          <TableCell>
                            {note ? (
                              <Badge variant={gradeVariant(on20)} title={formatOn20(on20)}>
                                {formatRawGrade(note.noteValue, noteMaximale)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Non noté</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-56 truncate text-sm text-muted-foreground" title={note?.comment ?? ""}>
                            {note?.comment && note.comment !== DEFAULT_COMMENT ? note.comment : ""}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Button
                              size="sm"
                              variant={note ? "outline" : "default"}
                              onClick={() => openGradeDialog(student)}
                            >
                              {note ? <Edit className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                              {note ? "Modifier" : "Noter"}
                            </Button>
                            {note && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setCommenting({ student, note })
                                    setComment(note.comment && note.comment !== DEFAULT_COMMENT ? note.comment : "")
                                  }}
                                  aria-label={`Commentaire pour ${fullName(student)}`}
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => confirmDelete.ask({ student, note })}
                                  aria-label={`Supprimer la note de ${fullName(student)}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        subjects.data.length > 0 &&
        evaluations.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground space-y-2">
                <BookOpen className="w-12 h-12 mx-auto opacity-50" aria-hidden />
                <p className="text-lg font-medium">Sélectionnez une matière et une évaluation</p>
              </div>
            </CardContent>
          </Card>
        )
      )}

      <Dialog open={gradeDialog !== null} onOpenChange={(open) => !open && !isSubmitting && setGradeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{gradeDialog?.note ? "Modifier la note" : "Saisir une note"}</DialogTitle>
            <DialogDescription>
              {gradeDialog && fullName(gradeDialog.student)} — {subject?.name},{" "}
              {evaluationLabel(evaluations.find((e) => e.id === evaluationId))}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveGrade} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="grade-value">Note (sur {noteMaximale}) *</Label>
              <Input
                id="grade-value"
                type="number"
                inputMode="decimal"
                min="0"
                max={noteMaximale}
                step="any"
                autoFocus
                placeholder={`Entre 0 et ${noteMaximale}`}
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                aria-invalid={!!valueError}
              />
              {valueError ? (
                <p className="text-sm text-destructive">{valueError}</p>
              ) : (
                gradeValue.trim() !== "" && (
                  <p className="text-sm text-muted-foreground">Soit {formatOn20(toTwenty(parsedValue, noteMaximale))}</p>
                )
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade-comment">Commentaire (facultatif)</Label>
              <Textarea
                id="grade-comment"
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Appréciation sur la copie..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || gradeValue.trim() === "" || !!valueError}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={commenting !== null} onOpenChange={(open) => !open && !isSubmitting && setCommenting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commentaire</DialogTitle>
            <DialogDescription>
              {commenting && `${fullName(commenting.student)} — ${formatRawGrade(commenting.note.noteValue, noteMaximale)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              aria-label="Commentaire"
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Laisser vide pour effacer le commentaire"
            />
            <Button className="w-full" onClick={handleSaveComment} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer le commentaire
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        {...confirmDelete.dialogProps}
        title="Supprimer la note"
        description={
          confirmDelete.target
            ? `Supprimer la note ${formatRawGrade(confirmDelete.target.note.noteValue, noteMaximale)} de ${fullName(confirmDelete.target.student)} ?`
            : ""
        }
        onConfirm={async () => {
          if (!confirmDelete.target) return
          const { ok } = await runAction(
            () => gradeApi.delete(confirmDelete.target!.note.noteId),
            "Note supprimée",
            "Erreur lors de la suppression",
          )
          if (ok) await students.reload()
        }}
      />
    </div>
  )
}
