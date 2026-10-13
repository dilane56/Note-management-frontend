"use client"

import { useState } from "react"
import { BookOpen, Edit, Loader2 } from "lucide-react"
import { ErrorState, SectionHeader, TableStateRow } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { runAction, useAsync } from "@/hooks/useAsync"
import { subjectApi } from "@/lib/subject-api"
import { teacherApi } from "@/lib/teacher-api"
import type { Subject } from "@/lib/types"

export function MySubjects() {
  const { user } = useAuth()
  const { data: subjects, loading, error, reload } = useAsync<Subject[]>(
    () => teacherApi.getSubjects(user!.id),
    [user?.id],
    [],
    !!user?.id,
  )
  const [editing, setEditing] = useState<Subject | null>(null)
  const [coefficient, setCoefficient] = useState("")
  const [saving, setSaving] = useState(false)

  const parsed = Number(coefficient.replace(",", "."))
  const invalid = !(parsed > 0)

  const handleSave = async () => {
    if (!editing || invalid) return
    setSaving(true)
    const { ok } = await runAction(
      () => subjectApi.updateCoefficient(editing.id, parsed),
      "Coefficient mis à jour",
      "Erreur lors de la mise à jour du coefficient",
    )
    setSaving(false)
    if (ok) {
      setEditing(null)
      await reload()
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Mes matières" description="Matières qui vous sont assignées" />

      {error && <ErrorState message={error} onRetry={reload} />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" aria-hidden />
            Matières assignées ({subjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Note maximale</TableHead>
                <TableHead className="hidden md:table-cell">Enseignants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || subjects.length === 0 ? (
                <TableStateRow colSpan={6} loading={loading} emptyLabel="Aucune matière assignée" />
              ) : (
                subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.className || "-"}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">{subject.coefficient}</span>
                    </TableCell>
                    <TableCell>{subject.noteMaximale}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {subject.teachers.map((t) => (
                          <Badge key={t.teacherId} variant={t.teacherId === user?.id ? "default" : "secondary"}>
                            {t.teacherFirstName} {t.teacherLastName}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(subject)
                          setCoefficient(String(subject.coefficient))
                        }}
                        aria-label={`Modifier le coefficient de ${subject.name}`}
                        title="Modifier le coefficient"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && !saving && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le coefficient</DialogTitle>
            <DialogDescription>
              {editing?.name} — {editing?.className}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coefficient">Nouveau coefficient</Label>
              <Input
                id="coefficient"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={coefficient}
                onChange={(e) => setCoefficient(e.target.value)}
                aria-invalid={invalid}
              />
              {invalid && <p className="text-sm text-destructive">Le coefficient doit être supérieur à 0</p>}
              <p className="text-sm text-muted-foreground">
                Le coefficient s&apos;applique à toute la classe : les moyennes et les classements seront recalculés.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1" disabled={saving || invalid}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enregistrer
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)} className="flex-1" disabled={saving}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
