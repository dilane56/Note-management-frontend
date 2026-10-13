"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Download, FileArchive, FileText, Loader2, Mail } from "lucide-react"
import { EvaluationSelect, ErrorState, LoadingState, SectionHeader, TableStateRow } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { runAction, useAsync } from "@/hooks/useAsync"
import { useClasses } from "@/hooks/useClasses"
import { useEvaluations } from "@/hooks/useEvaluations"
import { formatOn20, formatPercent } from "@/lib/format"
import { studentApi } from "@/lib/student-api"
import { transcriptApi } from "@/lib/transcript-api"
import type { SchoolClass, TranscriptStats } from "@/lib/types"

function ClassTranscripts({ schoolClass, evaluationId }: { schoolClass: SchoolClass; evaluationId: number }) {
  const [busy, setBusy] = useState<string | null>(null)
  const stats = useAsync<TranscriptStats | null>(
    () => transcriptApi.getClassStats(schoolClass.id, evaluationId),
    [schoolClass.id, evaluationId],
    null,
  )

  const run = async (key: string, action: () => Promise<unknown>, success?: string) => {
    setBusy(key)
    await runAction(action, success, "Opération impossible")
    setBusy(null)
  }

  const students = [...schoolClass.students].sort((a, b) => a.studentLastName.localeCompare(b.studentLastName, "fr"))

  return (
    <div className="space-y-4 rounded-md border bg-muted/30 p-4">
      {stats.loading ? (
        <LoadingState label="Calcul des statistiques..." />
      ) : stats.error ? (
        <ErrorState message={stats.error} onRetry={stats.reload} />
      ) : (
        stats.data && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Relevés</p>
              <p className="font-semibold">
                {stats.data.studentsWithTranscripts}/{stats.data.totalStudents}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Moyenne de classe</p>
              <p className="font-semibold">{formatOn20(stats.data.classAverage)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Meilleure / plus basse</p>
              <p className="font-semibold">
                {formatOn20(stats.data.highestAverage)} · {formatOn20(stats.data.lowestAverage)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Admis / non admis</p>
              <p className="font-semibold">
                {stats.data.passedStudents} / {stats.data.failedStudents}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Taux de réussite</p>
              <p className="font-semibold">{formatPercent(stats.data.passRate)}</p>
            </div>
          </div>
        )
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Matricule</TableHead>
            <TableHead>Étudiant</TableHead>
            <TableHead className="text-right">Relevé individuel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableStateRow colSpan={3} loading={false} emptyLabel="Aucun étudiant dans cette classe" />
          ) : (
            students.map((student) => {
              const name = `${student.studentFirstName} ${student.studentLastName}`
              return (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <Badge variant="outline">{student.studentMatricule || "-"}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy !== null}
                      onClick={() => run(`pdf-${student.studentId}`, () => studentApi.downloadTranscript(student.studentId, evaluationId))}
                      aria-label={`Télécharger le relevé de ${name}`}
                    >
                      {busy === `pdf-${student.studentId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span className="hidden sm:inline">PDF</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy !== null}
                      onClick={() =>
                        run(
                          `mail-${student.studentId}`,
                          () => transcriptApi.sendByEmail(student.studentId, evaluationId),
                          `Relevé envoyé à ${name}`,
                        )
                      }
                      aria-label={`Envoyer le relevé par email à ${name}`}
                    >
                      {busy === `mail-${student.studentId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      <span className="hidden sm:inline">Email</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function TranscriptManagement() {
  const { evaluations, error: evaluationsError } = useEvaluations()
  const { classes, filieres, loading, error, reload } = useClasses()
  const [selectedFiliere, setSelectedFiliere] = useState("all")
  const [selectedEvaluation, setSelectedEvaluation] = useState("")
  const [expandedClass, setExpandedClass] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const filteredClasses = classes.filter(
    (schoolClass) => selectedFiliere === "all" || String(schoolClass.filiereId) === selectedFiliere,
  )
  const evaluationId = selectedEvaluation ? Number(selectedEvaluation) : null

  const download = async (key: string, action: () => Promise<void>) => {
    setDownloading(key)
    await runAction(action, "Téléchargement terminé", "Erreur lors du téléchargement")
    setDownloading(null)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relevés de notes"
        description="Générez les relevés par classe ou par étudiant, et envoyez-les par email"
      />

      {(error || evaluationsError) && <ErrorState message={error || evaluationsError || ""} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transcript-evaluation">Évaluation *</Label>
              <EvaluationSelect
                id="transcript-evaluation"
                evaluations={evaluations}
                value={selectedEvaluation}
                onChange={setSelectedEvaluation}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transcript-filiere">Filière</Label>
              <Select value={selectedFiliere} onValueChange={setSelectedFiliere}>
                <SelectTrigger id="transcript-filiere" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les filières</SelectItem>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere.id} value={String(filiere.id)}>
                      {filiere.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes ({filteredClasses.length})</CardTitle>
          <CardDescription>
            {evaluationId
              ? "Téléchargez tous les relevés d'une classe (ZIP : un PDF par étudiant, ou PDF unique), ou dépliez la classe pour les relevés individuels."
              : "Sélectionnez d'abord une évaluation."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Classe</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead className="text-right">Toute la classe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || filteredClasses.length === 0 ? (
                <TableStateRow colSpan={5} loading={loading} emptyLabel="Aucune classe trouvée" />
              ) : (
                filteredClasses.map((schoolClass) => {
                  const expanded = expandedClass === schoolClass.id && evaluationId !== null
                  const noStudents = schoolClass.students.length === 0
                  return [
                    <TableRow key={schoolClass.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={!evaluationId}
                          onClick={() => setExpandedClass(expanded ? null : schoolClass.id)}
                          aria-expanded={expanded}
                          aria-label={expanded ? "Replier" : `Afficher les étudiants de ${schoolClass.className}`}
                        >
                          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{schoolClass.className}</TableCell>
                      <TableCell>{schoolClass.filiereName}</TableCell>
                      <TableCell>{schoolClass.students.length}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="mr-2"
                          disabled={!evaluationId || noStudents || downloading !== null}
                          onClick={() =>
                            evaluationId &&
                            download(`zip-${schoolClass.id}`, () =>
                              transcriptApi.downloadClassZip(schoolClass.id, evaluationId, schoolClass.className),
                            )
                          }
                        >
                          {downloading === `zip-${schoolClass.id}` ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <FileArchive className="w-4 h-4 mr-1" />
                          )}
                          ZIP
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!evaluationId || noStudents || downloading !== null}
                          onClick={() =>
                            evaluationId &&
                            download(`pdf-${schoolClass.id}`, () =>
                              transcriptApi.downloadClassPdf(schoolClass.id, evaluationId, schoolClass.className),
                            )
                          }
                        >
                          {downloading === `pdf-${schoolClass.id}` ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4 mr-1" />
                          )}
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>,
                    expanded && evaluationId !== null ? (
                      <TableRow key={`${schoolClass.id}-details`} className="hover:bg-transparent">
                        <TableCell colSpan={5}>
                          <ClassTranscripts schoolClass={schoolClass} evaluationId={evaluationId} />
                        </TableCell>
                      </TableRow>
                    ) : null,
                  ]
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
