"use client"

import { BookOpen } from "lucide-react"
import { ErrorState, SectionHeader, TableStateRow } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { useAsync } from "@/hooks/useAsync"
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
          <CardDescription>
            Le coefficient et la note maximale sont fixés par l&apos;administration : contactez-la pour les modifier.
          </CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || subjects.length === 0 ? (
                <TableStateRow colSpan={5} loading={loading} emptyLabel="Aucune matière assignée" />
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
