"use client"

import { BookOpen, Building2, CheckSquare, FileDown, FileText, School, TrendingUp, Users } from "lucide-react"
import { ClassManagement } from "./admin/class-management"
import { EvaluationManagement } from "./admin/evaluation-management"
import { FiliereManagement } from "./admin/filiere-management"
import { ReportsManagement } from "./admin/reports-management"
import { StatisticsManagement } from "./admin/statistics-management"
import { SubjectManagement } from "./admin/subject-management"
import { TranscriptManagement } from "./admin/transcript-management"
import { UserManagement } from "./admin/user-management"
import { ErrorState, SectionHeader, StatCard, TableStateRow } from "./shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAsync } from "@/hooks/useAsync"
import { classApi } from "@/lib/class-api"
import { evaluationApi } from "@/lib/evaluation-api"
import { filiereApi } from "@/lib/filiere-api"
import { fullName, roleLabel } from "@/lib/format"
import { subjectApi } from "@/lib/subject-api"
import type { Evaluation, Filiere, SchoolClass, Subject, UserResponse } from "@/lib/types"
import { userApi } from "@/lib/user-api"

interface DashboardProps {
  section: string
  onNavigate: (section: string) => void
}

interface Overview {
  users: UserResponse[]
  subjects: Subject[]
  classes: SchoolClass[]
  filieres: Filiere[]
  evaluations: Evaluation[]
}

function AdminOverview({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { data, loading, error, reload } = useAsync<Overview>(
    async () => {
      const [users, subjects, classes, filieres, evaluations] = await Promise.all([
        userApi.getUsers(),
        subjectApi.getSubjects(),
        classApi.getClasses(),
        filiereApi.getFilieres(),
        evaluationApi.getEvaluations(),
      ])
      return { users, subjects, classes, filieres, evaluations }
    },
    [],
    { users: [], subjects: [], classes: [], filieres: [], evaluations: [] },
  )

  const count = (role: UserResponse["role"]) => data.users.filter((u) => u.role === role).length
  const value = (n: number) => (loading ? "…" : n.toLocaleString("fr-FR"))
  // Les identifiants sont croissants : les plus grands correspondent aux comptes les plus récents.
  const recentUsers = [...data.users].sort((a, b) => b.id - a.id).slice(0, 5)
  const subjectsWithoutTeacher = data.subjects.filter((s) => s.teachers.length === 0).length
  const emptyClasses = data.classes.filter((c) => c.students.length === 0).length

  const shortcuts = [
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "subjects", label: "Matières", icon: BookOpen },
    { id: "evaluations", label: "Évaluations", icon: CheckSquare },
    { id: "transcripts", label: "Relevés", icon: FileText },
    { id: "reports", label: "Exports Excel", icon: FileDown },
    { id: "statistics", label: "Statistiques", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader title="Tableau de bord" description="Vue d'ensemble de l'établissement" />

      {error && <ErrorState message={error} onRetry={reload} />}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Étudiants" value={value(count("STUDENT"))} hint="Inscrits" icon={Users} />
        <StatCard title="Enseignants" value={value(count("TEACHER"))} hint="Comptes" icon={BookOpen} />
        <StatCard title="Classes" value={value(data.classes.length)} hint={`${data.filieres.length} filière(s)`} icon={School} />
        <StatCard title="Matières" value={value(data.subjects.length)} hint="Toutes classes" icon={Building2} />
        <StatCard title="Évaluations" value={value(data.evaluations.length)} hint="Périodes" icon={CheckSquare} />
      </div>

      {!loading && (subjectsWithoutTeacher > 0 || emptyClasses > 0 || data.evaluations.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Points d&apos;attention</CardTitle>
            <CardDescription>Configuration à compléter avant la saisie des notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.evaluations.length === 0 && (
              <p>
                Aucune évaluation n&apos;est créée : les enseignants ne peuvent pas saisir de notes.{" "}
                <Button variant="link" className="h-auto p-0" onClick={() => onNavigate("evaluations")}>
                  Créer une évaluation
                </Button>
              </p>
            )}
            {subjectsWithoutTeacher > 0 && (
              <p>
                {subjectsWithoutTeacher} matière(s) sans enseignant.{" "}
                <Button variant="link" className="h-auto p-0" onClick={() => onNavigate("subjects")}>
                  Assigner
                </Button>
              </p>
            )}
            {emptyClasses > 0 && <p>{emptyClasses} classe(s) sans étudiant.</p>}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accès rapide</CardTitle>
            <CardDescription>Fonctions de gestion principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shortcuts.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon className="w-6 h-6" aria-hidden />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers comptes créés</CardTitle>
              <CardDescription>Les 5 comptes les plus récents</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate("users")}>
              Tout voir
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading || recentUsers.length === 0 ? (
                  <TableStateRow colSpan={3} loading={loading} emptyLabel="Aucun utilisateur" />
                ) : (
                  recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{fullName(user)}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleLabel(user.role)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AdminDashboard({ section, onNavigate }: DashboardProps) {
  switch (section) {
    case "users":
      return <UserManagement />
    case "filieres":
      return <FiliereManagement />
    case "classes":
      return <ClassManagement />
    case "subjects":
      return <SubjectManagement />
    case "evaluations":
      return <EvaluationManagement />
    case "transcripts":
      return <TranscriptManagement />
    case "reports":
      return <ReportsManagement />
    case "statistics":
      return <StatisticsManagement />
    default:
      return <AdminOverview onNavigate={onNavigate} />
  }
}
