"use client"

import { useEffect, useMemo, useState } from "react"
import { Award, BarChart3, BookOpen, Download, FileSpreadsheet, List, Loader2, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ErrorState, EvaluationSelect, LoadingState, SectionHeader, StatCard, TableStateRow } from "./shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { runAction, useAsync } from "@/hooks/useAsync"
import { useEvaluations } from "@/hooks/useEvaluations"
import { ApiError } from "@/lib/api"
import {
  evaluationLabel,
  formatOn20,
  formatRank,
  formatRawGrade,
  gradeColor,
  gradeVariant,
  round,
  toTwenty,
} from "@/lib/format"
import { gradeApi } from "@/lib/grade-api"
import { studentApi } from "@/lib/student-api"
import type { Evaluation, Grade, StudentRanking, Transcript } from "@/lib/types"

const DEFAULT_COMMENT = "RAS"

/** Notes de l'étudiant et évaluations pour lesquelles il a au moins une note. */
function useStudentData() {
  const { user } = useAuth()
  const { evaluations, loading: evaluationsLoading } = useEvaluations()
  const grades = useAsync<Grade[]>(() => gradeApi.getStudentGrades(user!.id), [user?.id], [], !!user?.id)

  const gradedEvaluations = useMemo(() => {
    const ids = new Set(grades.data.map((g) => g.evaluation?.id))
    return evaluations.filter((e) => ids.has(e.id))
  }, [evaluations, grades.data])

  return { user, evaluations, gradedEvaluations, grades, loading: grades.loading || evaluationsLoading }
}

/** Relevé (moyenne et rang) d'une évaluation ; null si aucune note n'est encore saisie. */
function useTranscript(studentId: number | undefined, evaluationId: number) {
  return useAsync<Transcript | null>(
    async () => {
      try {
        return await studentApi.previewTranscript(studentId!, evaluationId)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }
    },
    [studentId, evaluationId],
    null,
    !!studentId && evaluationId > 0,
  )
}

function GradesOverview() {
  const { user, gradedEvaluations, grades, loading } = useStudentData()
  const [selectedEvaluation, setSelectedEvaluation] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "chart">("list")

  // Par défaut : l'évaluation notée la plus récente (les évaluations sont triées de la plus récente à la plus ancienne).
  useEffect(() => {
    if (!selectedEvaluation && !loading) {
      setSelectedEvaluation(gradedEvaluations.length > 0 ? String(gradedEvaluations[0].id) : "all")
    }
  }, [gradedEvaluations, loading, selectedEvaluation])

  const evaluationId = selectedEvaluation && selectedEvaluation !== "all" ? Number(selectedEvaluation) : 0
  const transcript = useTranscript(user?.id, evaluationId)
  const globalRanking = useAsync<StudentRanking | null>(
    () => studentApi.getRanking(user!.id),
    [user?.id],
    null,
    !!user?.id && selectedEvaluation === "all",
  )

  const filteredGrades = grades.data
    .filter((g) => !evaluationId || g.evaluation?.id === evaluationId)
    .sort((a, b) => a.subjectName.localeCompare(b.subjectName, "fr"))
  const ranking = evaluationId ? transcript.data?.ranking ?? null : globalRanking.data
  const average = evaluationId ? transcript.data?.average : globalRanking.data?.studentAverage
  const hasGrades = filteredGrades.length > 0
  const subjectCount = new Set(filteredGrades.map((g) => g.subjectId)).size
  const statsLoading = evaluationId ? transcript.loading : globalRanking.loading
  const scopeLabel = evaluationId
    ? evaluationLabel(gradedEvaluations.find((e) => e.id === evaluationId))
    : "Toutes évaluations confondues"

  const chartData = filteredGrades.map((g) => {
    const on20 = round(toTwenty(g.noteValue, g.noteMaximale))
    const label = evaluationId ? g.subjectName : `${g.subjectName} (${evaluationLabel(g.evaluation)})`
    return { key: g.gradeId, name: label.length > 14 ? `${label.slice(0, 13)}…` : label, fullName: label, note: on20 }
  })

  if (loading) return <LoadingState label="Chargement de vos notes..." />

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mes notes"
        description={scopeLabel}
        actions={
          <div className="w-64">
            <EvaluationSelect
              evaluations={gradedEvaluations}
              value={selectedEvaluation}
              onChange={setSelectedEvaluation}
              includeAll
            />
          </div>
        }
      />

      {grades.error && <ErrorState message={grades.error} onRetry={grades.reload} />}
      {(transcript.error || globalRanking.error) && (
        <ErrorState message={transcript.error || globalRanking.error || ""} onRetry={evaluationId ? transcript.reload : globalRanking.reload} />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Moyenne générale"
          value={statsLoading ? "…" : hasGrades ? formatOn20(average) : "-"}
          hint="Pondérée par les coefficients"
          icon={Award}
          valueClassName="text-primary"
        />
        <StatCard
          title="Rang"
          value={statsLoading ? "…" : formatRank(ranking)}
          hint="Dans la classe"
          icon={TrendingUp}
        />
        <StatCard
          title="Moyenne de la classe"
          value={statsLoading ? "…" : hasGrades && ranking ? formatOn20(ranking.classAverage) : "-"}
          hint={scopeLabel}
          icon={BarChart3}
        />
        <StatCard title="Matières notées" value={subjectCount} hint={`${filteredGrades.length} note(s)`} icon={BookOpen} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Notes par matière</CardTitle>
            <CardDescription>Note sur le barème de la matière et équivalent sur 20</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              aria-label="Afficher en liste"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "chart" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("chart")}
              aria-label="Afficher en graphique"
              aria-pressed={viewMode === "chart"}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!hasGrades ? (
            <div className="text-center py-8 text-muted-foreground">Aucune note disponible pour le moment.</div>
          ) : viewMode === "list" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead>
                  {!evaluationId && <TableHead>Évaluation</TableHead>}
                  <TableHead>Coef.</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Sur 20</TableHead>
                  <TableHead className="hidden md:table-cell">Commentaire</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => {
                  const on20 = toTwenty(grade.noteValue, grade.noteMaximale)
                  return (
                    <TableRow key={grade.gradeId}>
                      <TableCell className="font-medium">{grade.subjectName}</TableCell>
                      {!evaluationId && <TableCell>{evaluationLabel(grade.evaluation)}</TableCell>}
                      <TableCell>{grade.coefficient}</TableCell>
                      <TableCell>{formatRawGrade(grade.noteValue, grade.noteMaximale)}</TableCell>
                      <TableCell>
                        <Badge variant={gradeVariant(on20)}>{formatOn20(on20)}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {grade.comment && grade.comment !== DEFAULT_COMMENT ? grade.comment : ""}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} fontSize={12} stroke="currentColor" />
                  <YAxis domain={[0, 20]} stroke="currentColor" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [`${value}/20`, "Note"]}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName ?? ""}
                    contentStyle={{
                      background: "var(--popover)",
                      color: "var(--popover-foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                    }}
                  />
                  <Bar dataKey="note" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={gradeColor(entry.note)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TranscriptsSection() {
  const { user, gradedEvaluations, loading } = useStudentData()
  const [selectedEvaluation, setSelectedEvaluation] = useState("")
  const [busy, setBusy] = useState<"pdf" | "excel" | null>(null)

  useEffect(() => {
    if (!selectedEvaluation && gradedEvaluations.length > 0) setSelectedEvaluation(String(gradedEvaluations[0].id))
  }, [gradedEvaluations, selectedEvaluation])

  const evaluationId = Number(selectedEvaluation)
  const transcript = useTranscript(user?.id, evaluationId)
  const evaluation: Evaluation | undefined = gradedEvaluations.find((e) => e.id === evaluationId)

  const run = async (kind: "pdf" | "excel", action: () => Promise<void>) => {
    setBusy(kind)
    await runAction(action, "Téléchargement terminé", "Erreur lors du téléchargement")
    setBusy(null)
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-6">
      <SectionHeader title="Relevés et exports" description="Consultez et téléchargez vos relevés de notes" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Relevé de notes (PDF)</CardTitle>
            <CardDescription>Un relevé par évaluation, avec votre moyenne et votre rang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gradedEvaluations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune note n&apos;a encore été saisie : aucun relevé disponible.</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="transcript-evaluation">Évaluation</Label>
                  <EvaluationSelect
                    id="transcript-evaluation"
                    evaluations={gradedEvaluations}
                    value={selectedEvaluation}
                    onChange={setSelectedEvaluation}
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={!evaluationId || busy !== null}
                  onClick={() => user && run("pdf", () => studentApi.downloadTranscript(user.id, evaluationId))}
                >
                  {busy === "pdf" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  Télécharger le relevé PDF
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toutes mes notes (Excel)</CardTitle>
            <CardDescription>Export de l&apos;ensemble de vos notes, toutes évaluations confondues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              disabled={busy !== null}
              onClick={() => user && run("excel", () => studentApi.exportGrades(user.id))}
            >
              {busy === "excel" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
              Exporter mes notes
            </Button>
          </CardContent>
        </Card>
      </div>

      {evaluationId > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu — {evaluationLabel(evaluation)}</CardTitle>
            {transcript.data && (
              <CardDescription>
                Moyenne {formatOn20(transcript.data.average)} · rang {formatRank(transcript.data.ranking)} · moyenne de la
                classe {formatOn20(transcript.data.ranking?.classAverage)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {transcript.error ? (
              <ErrorState message={transcript.error} onRetry={transcript.reload} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Coef.</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Sur 20</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcript.loading || !transcript.data || transcript.data.grades.length === 0 ? (
                    <TableStateRow colSpan={4} loading={transcript.loading} emptyLabel="Aucune note pour cette évaluation" />
                  ) : (
                    transcript.data.grades.map((grade) => {
                      const on20 = toTwenty(grade.noteValue, grade.noteMaximale)
                      return (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">{grade.subjectName}</TableCell>
                          <TableCell>{grade.coefficient}</TableCell>
                          <TableCell>{formatRawGrade(grade.noteValue, grade.noteMaximale)}</TableCell>
                          <TableCell>
                            <Badge variant={gradeVariant(on20)}>{formatOn20(on20)}</Badge>
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
      )}
    </div>
  )
}

export function StudentDashboard({ section }: { section: string }) {
  return section === "transcripts" ? <TranscriptsSection /> : <GradesOverview />
}
