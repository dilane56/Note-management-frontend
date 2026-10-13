"use client"

import { useEffect, useState } from "react"
import { Award, BarChart3, BookOpen, TrendingDown, TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ClassSelect, EvaluationSelect, ErrorState, LoadingState, StatCard, TableStateRow } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAsync } from "@/hooks/useAsync"
import { useEvaluations } from "@/hooks/useEvaluations"
import { evaluationLabel, formatOn20, formatRawGrade, gradeColor, gradeVariant, round, toTwenty } from "@/lib/format"
import { statisticsApi } from "@/lib/statistics-api"
import type { ClassStatistics, SchoolClass, StudentPerformance, SubjectStatistics } from "@/lib/types"

interface Stats {
  classStats: ClassStatistics | null
  subjects: SubjectStatistics[]
  students: StudentPerformance[]
}

const EMPTY: Stats = { classStats: null, subjects: [], students: [] }

/** Statistiques d'une classe pour une évaluation (admin : toutes les classes ; enseignant : ses classes). */
export function StatisticsView({ classes, initialClassId }: { classes: SchoolClass[]; initialClassId?: number }) {
  const { evaluations } = useEvaluations()
  const [selectedClass, setSelectedClass] = useState(initialClassId ? String(initialClassId) : "")
  const [selectedEvaluation, setSelectedEvaluation] = useState("")

  // Par défaut : l'évaluation la plus récente.
  useEffect(() => {
    if (!selectedEvaluation && evaluations.length > 0) setSelectedEvaluation(String(evaluations[0].id))
  }, [evaluations, selectedEvaluation])

  const classId = Number(selectedClass)
  const evaluationId = Number(selectedEvaluation)
  const ready = classId > 0 && evaluationId > 0

  const { data, loading, error, reload } = useAsync<Stats>(
    async () => {
      const [classStats, subjects, students] = await Promise.all([
        statisticsApi.getClassStats(classId, evaluationId),
        statisticsApi.getSubjectStats(classId, evaluationId),
        statisticsApi.getStudentStats(classId, evaluationId),
      ])
      return { classStats, subjects, students }
    },
    [classId, evaluationId],
    EMPTY,
    ready,
  )

  const evaluation = evaluations.find((e) => e.id === evaluationId)
  const schoolClass = classes.find((c) => c.id === classId)
  const hasGrades = data.subjects.some((s) => s.totalGrades > 0)
  const chartData = data.subjects
    .filter((s) => s.totalGrades > 0)
    .map((s) => ({ name: s.subjectName, moyenne: round(toTwenty(s.average, s.noteMaximale)) }))

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stats-class">Classe</Label>
              <ClassSelect id="stats-class" classes={classes} value={selectedClass} onChange={setSelectedClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-evaluation">Évaluation</Label>
              <EvaluationSelect
                id="stats-evaluation"
                evaluations={evaluations}
                value={selectedEvaluation}
                onChange={setSelectedEvaluation}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!ready ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Sélectionnez une classe et une évaluation pour afficher les statistiques.
          </CardContent>
        </Card>
      ) : loading ? (
        <LoadingState label="Chargement des statistiques..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !hasGrades ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune note n&apos;a encore été saisie pour {schoolClass?.className} — {evaluationLabel(evaluation)}.
          </CardContent>
        </Card>
      ) : (
        <>
          {data.classStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Moyenne de classe"
                value={formatOn20(data.classStats.classAverage)}
                hint={schoolClass?.className}
                icon={BarChart3}
                valueClassName="text-primary"
              />
              <StatCard
                title="Meilleure moyenne"
                value={formatOn20(data.classStats.highestGrade)}
                hint={`Plus basse : ${formatOn20(data.classStats.lowestGrade)}`}
                icon={TrendingUp}
              />
              <StatCard
                title="Étudiants notés"
                value={data.classStats.totalStudents}
                hint={`${schoolClass?.students.length ?? 0} inscrit(s)`}
                icon={Users}
              />
              <StatCard
                title="≥ moyenne de classe"
                value={data.classStats.studentsAboveAverage}
                hint={`${data.classStats.studentsBelowAverage} en dessous`}
                icon={Award}
              />
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Moyenne par matière (sur 20)</CardTitle>
              <CardDescription>{evaluationLabel(evaluation)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} fontSize={12} stroke="currentColor" />
                    <YAxis domain={[0, 20]} stroke="currentColor" fontSize={12} />
                    <Tooltip
                      formatter={(value: number) => [`${value}/20`, "Moyenne"]}
                      contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 6 }}
                    />
                    <Bar dataKey="moyenne" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={gradeColor(entry.moyenne)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" aria-hidden />
                  Détail par matière
                </CardTitle>
                <CardDescription>Notes exprimées sur le barème de chaque matière</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Coef.</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Min / Max</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.subjects.map((subject) => {
                      const on20 = toTwenty(subject.average, subject.noteMaximale)
                      return (
                        <TableRow key={subject.subjectName}>
                          <TableCell className="font-medium">{subject.subjectName}</TableCell>
                          <TableCell>{subject.coefficient}</TableCell>
                          <TableCell>
                            {subject.totalGrades > 0 ? (
                              <Badge variant={gradeVariant(on20)} title={formatOn20(on20)}>
                                {formatRawGrade(subject.average, subject.noteMaximale)}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {subject.totalGrades > 0 ? (
                              <>
                                <TrendingDown className="inline w-3 h-3 mr-1" aria-hidden />
                                {subject.lowestGrade} · {subject.highestGrade}
                              </>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{subject.totalGrades}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" aria-hidden />
                  Classement des étudiants
                </CardTitle>
                <CardDescription>Moyenne générale pondérée, sur 20</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Matières ≥ 10</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.students.length === 0 ? (
                      <TableStateRow colSpan={4} loading={false} emptyLabel="Aucun étudiant noté" />
                    ) : (
                      data.students.map((student) => (
                        <TableRow key={student.studentId}>
                          <TableCell>
                            <Badge variant={student.rank <= 3 ? "default" : "outline"}>{student.rank}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{student.studentName}</TableCell>
                          <TableCell>
                            <Badge variant={gradeVariant(student.average)}>{formatOn20(student.average)}</Badge>
                          </TableCell>
                          <TableCell>
                            {student.passedSubjects}/{student.totalSubjects}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
