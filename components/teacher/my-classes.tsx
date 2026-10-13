"use client"

import { useState } from "react"
import { BarChart3, BookOpen, Users } from "lucide-react"
import { ErrorState, LoadingState, SectionHeader, TableStateRow } from "@/components/shared"
import { StatisticsView } from "@/components/statistics-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { useAsync } from "@/hooks/useAsync"
import { teacherApi } from "@/lib/teacher-api"
import type { SchoolClass, Subject } from "@/lib/types"

export function MyClasses() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useAsync<{ classes: SchoolClass[]; subjects: Subject[] }>(
    async () => {
      const [classes, subjects] = await Promise.all([teacherApi.getClasses(user!.id), teacherApi.getSubjects(user!.id)])
      return { classes, subjects }
    },
    [user?.id],
    { classes: [], subjects: [] },
    !!user?.id,
  )
  const [studentsOf, setStudentsOf] = useState<SchoolClass | null>(null)
  const [statsClassId, setStatsClassId] = useState<number | null>(null)

  if (loading) return <LoadingState label="Chargement des classes..." />

  return (
    <div className="space-y-6">
      <SectionHeader title="Mes classes" description="Classes dans lesquelles vous enseignez" />

      {error && <ErrorState message={error} onRetry={reload} />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.classes.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune classe ne vous est assignée pour le moment.
            </CardContent>
          </Card>
        ) : (
          data.classes.map((schoolClass) => {
            const classSubjects = data.subjects.filter((s) => s.classId === schoolClass.id)
            return (
              <Card key={schoolClass.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{schoolClass.className}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{schoolClass.filiereName}</Badge>
                    <Badge variant="outline">{schoolClass.students.length} étudiant(s)</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                    <span>{classSubjects.map((s) => s.name).join(", ") || "-"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setStudentsOf(schoolClass)}>
                      <Users className="w-4 h-4 mr-1" />
                      Étudiants
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStatsClassId(schoolClass.id)
                        document.getElementById("class-stats")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Statistiques
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {data.classes.length > 0 && (
        <div className="space-y-4">
          <h3 id="class-stats" className="text-xl font-semibold scroll-mt-24">Statistiques</h3>
          <StatisticsView key={statsClassId ?? "none"} classes={data.classes} initialClassId={statsClassId ?? undefined} />
        </div>
      )}

      <Dialog open={studentsOf !== null} onOpenChange={(open) => !open && setStudentsOf(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Étudiants — {studentsOf?.className}</DialogTitle>
            <DialogDescription>
              {studentsOf?.filiereName} · {studentsOf?.students.length ?? 0} étudiant(s)
            </DialogDescription>
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
                <TableStateRow colSpan={3} loading={false} emptyLabel="Aucun étudiant inscrit dans cette classe" />
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
    </div>
  )
}
