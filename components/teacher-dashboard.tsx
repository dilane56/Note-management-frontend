"use client"

import { AlertCircle, BookOpen, ClipboardList, GraduationCap, TrendingUp, Users } from "lucide-react"
import { ErrorState, SectionHeader, StatCard } from "./shared"
import { GradeEntry } from "./teacher/grade-entry"
import { MyClasses } from "./teacher/my-classes"
import { MySubjects } from "./teacher/my-subjects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useAsync } from "@/hooks/useAsync"
import { formatOn20, formatPercent } from "@/lib/format"
import { teacherApi } from "@/lib/teacher-api"
import type { SchoolClass, Subject, TeacherDashboard as TeacherStats } from "@/lib/types"

interface DashboardProps {
  section: string
  onNavigate: (section: string) => void
}

interface Overview {
  classes: SchoolClass[]
  subjects: Subject[]
  stats: TeacherStats | null
}

function TeacherOverview({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { user } = useAuth()
  const { data, loading, error, reload } = useAsync<Overview>(
    async () => {
      const [classes, subjects, stats] = await Promise.all([
        teacherApi.getClasses(user!.id),
        teacherApi.getSubjects(user!.id),
        teacherApi.getDashboard(user!.id),
      ])
      return { classes, subjects, stats }
    },
    [user?.id],
    { classes: [], subjects: [], stats: null },
    !!user?.id,
  )

  const value = (content: React.ReactNode) => (loading ? "…" : content)
  const hasGrades = (data.stats?.globalAverage ?? 0) > 0 || (data.stats?.successRate ?? 0) > 0

  return (
    <div className="space-y-6">
      <SectionHeader title="Tableau de bord" description={`Bonjour ${user?.name ?? ""}`} />

      {error && <ErrorState message={error} onRetry={reload} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Classes" value={value(data.stats?.totalClasses ?? data.classes.length)} hint="Assignées" icon={GraduationCap} />
        <StatCard
          title="Étudiants"
          value={value(data.stats?.totalStudents ?? data.classes.reduce((sum, c) => sum + c.students.length, 0))}
          hint="Dans vos classes"
          icon={Users}
        />
        <StatCard
          title="Moyenne générale"
          value={value(hasGrades ? formatOn20(data.stats?.globalAverage) : "-")}
          hint={hasGrades ? "Notes de vos matières, sur 20" : "Aucune note saisie"}
          icon={TrendingUp}
          valueClassName="text-primary"
        />
        <StatCard
          title="Taux de réussite"
          value={value(hasGrades ? formatPercent(data.stats?.successRate) : "-")}
          hint="Notes ≥ 10/20"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => onNavigate("grades")}>
              <ClipboardList className="w-4 h-4 mr-2" />
              Saisir des notes
            </Button>
            <Button variant="outline" className="w-full" onClick={() => onNavigate("my-subjects")}>
              <BookOpen className="w-4 h-4 mr-2" />
              Mes matières ({data.subjects.length})
            </Button>
            <Button variant="outline" className="w-full" onClick={() => onNavigate("my-classes")}>
              <Users className="w-4 h-4 mr-2" />
              Mes classes et statistiques ({data.classes.length})
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes classes</CardTitle>
            <CardDescription>Matières enseignées par classe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : data.classes.length === 0 ? (
              <p className="text-muted-foreground">Aucune classe assignée pour le moment.</p>
            ) : (
              data.classes.map((schoolClass) => {
                const classSubjects = data.subjects.filter((s) => s.classId === schoolClass.id)
                return (
                  <div key={schoolClass.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                    <div>
                      <p className="font-medium">{schoolClass.className}</p>
                      <p className="text-xs text-muted-foreground">
                        {schoolClass.filiereName} · {schoolClass.students.length} étudiant(s)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {classSubjects.map((s) => (
                        <Badge key={s.id} variant="secondary">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function TeacherDashboard({ section, onNavigate }: DashboardProps) {
  switch (section) {
    case "grades":
      return <GradeEntry />
    case "my-subjects":
      return <MySubjects />
    case "my-classes":
      return <MyClasses />
    default:
      return <TeacherOverview onNavigate={onNavigate} />
  }
}
