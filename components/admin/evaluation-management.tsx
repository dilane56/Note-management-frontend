"use client"

import type React from "react"
import { useState } from "react"
import { CheckSquare, Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"
import { ConfirmDialog, ErrorState, SectionHeader, TableStateRow, useConfirmDelete } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEvaluations } from "@/hooks/useEvaluations"
import { ACADEMIC_YEAR_PATTERN, EVALUATION_TYPES, evaluationLabel, evaluationTypeLabel, normalize } from "@/lib/format"
import type { Evaluation, TypeEvaluation } from "@/lib/types"

/** Année scolaire en cours, ex. « 2025-2026 » (la rentrée est supposée en septembre). */
const currentAcademicYear = () => {
  const now = new Date()
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1
  return `${start}-${start + 1}`
}

export function EvaluationManagement() {
  const { evaluations, loading, error, reload, createEvaluation, updateEvaluation, deleteEvaluation } = useEvaluations()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Evaluation | null>(null)
  const [type, setType] = useState<TypeEvaluation | "">("")
  const [year, setYear] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmDelete = useConfirmDelete<Evaluation>()

  const yearError = year.trim() && !ACADEMIC_YEAR_PATTERN.test(year.trim())
    ? "Format attendu : AAAA-AAAA (ex : 2025-2026)"
    : ""
  const duplicate = evaluations.some(
    (e) => e.id !== editing?.id && e.typeEvaluation === type && e.anneeAcademique.replace(/\s/g, "") === year.trim().replace(/\s/g, ""),
  )

  const term = normalize(searchTerm)
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      normalize(evaluationTypeLabel(evaluation.typeEvaluation)).includes(term) ||
      normalize(evaluation.anneeAcademique).includes(term)
    const matchesType = typeFilter === "all" || evaluation.typeEvaluation === typeFilter
    return matchesSearch && matchesType
  })

  const openCreate = () => {
    setEditing(null)
    setType("")
    setYear(currentAcademicYear())
    setDialogOpen(true)
  }

  const openEdit = (evaluation: Evaluation) => {
    setEditing(evaluation)
    setType(evaluation.typeEvaluation)
    setYear(evaluation.anneeAcademique)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!type || !year.trim() || yearError) return
    const payload = { type, anneeAcademique: year.trim() }
    setIsSubmitting(true)
    const ok = editing ? await updateEvaluation(editing.id, payload) : await createEvaluation(payload)
    setIsSubmitting(false)
    if (ok) setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion des évaluations"
        description="Périodes d'évaluation (séquences, trimestres, semestres) par année scolaire"
        actions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle évaluation
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={(open) => !isSubmitting && setDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'évaluation" : "Créer une évaluation"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifiez le type ou l'année de l'évaluation" : "Ajoutez une nouvelle période d'évaluation"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evaluation-type">Type d&apos;évaluation</Label>
              <Select value={type} onValueChange={(value) => setType(value as TypeEvaluation)}>
                <SelectTrigger id="evaluation-type" className="w-full">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {EVALUATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluation-year">Année académique</Label>
              <Input
                id="evaluation-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex : 2025-2026"
                aria-invalid={!!yearError}
                aria-describedby="evaluation-year-help"
                required
              />
              <p id="evaluation-year-help" className={`text-sm ${yearError ? "text-destructive" : "text-muted-foreground"}`}>
                {yearError || "Format AAAA-AAAA"}
              </p>
            </div>
            {duplicate && (
              <p className="text-sm text-amber-600">Une évaluation de ce type existe déjà pour cette année.</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting || !type || !year.trim() || !!yearError}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        {...confirmDelete.dialogProps}
        title="Supprimer l'évaluation"
        description={`Supprimer « ${evaluationLabel(confirmDelete.target)} » ? Une évaluation pour laquelle des notes ont été saisies ne peut pas être supprimée.`}
        onConfirm={() => confirmDelete.target && deleteEvaluation(confirmDelete.target.id)}
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Rechercher (type, année)..."
                aria-label="Rechercher une évaluation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="sm:w-48" aria-label="Filtrer par type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {EVALUATION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des évaluations ({filteredEvaluations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Année académique</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || filteredEvaluations.length === 0 ? (
                <TableStateRow colSpan={3} loading={loading} emptyLabel="Aucune évaluation trouvée" />
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-muted-foreground" aria-hidden />
                        <Badge variant="outline">{evaluationTypeLabel(evaluation.typeEvaluation)}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{evaluation.anneeAcademique}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(evaluation)}
                        aria-label={`Modifier ${evaluationLabel(evaluation)}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirmDelete.ask(evaluation)}
                        aria-label={`Supprimer ${evaluationLabel(evaluation)}`}
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
