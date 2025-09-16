"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, BookOpen, TrendingUp, Calendar, Users } from "lucide-react"

interface SubjectDetailsProps {
  subjectData: {
    id: number
    name: string
    className: string
    coefficient: number
  }
  onBack: () => void
}

export function SubjectDetails({ subjectData, onBack }: SubjectDetailsProps) {
  const [evaluations] = useState([
    { id: 1, type: "Contrôle", date: "2024-01-15", average: 14.5, students: 28 },
    { id: 2, type: "Devoir Maison", date: "2024-01-22", average: 16.2, students: 28 },
    { id: 3, type: "Interrogation", date: "2024-01-29", average: 13.8, students: 27 },
  ])

  const [recentGrades] = useState([
    { studentName: "Alice Martin", grade: 16.5, evaluation: "Contrôle", date: "2024-01-15" },
    { studentName: "Bob Dupont", grade: 14.2, evaluation: "Contrôle", date: "2024-01-15" },
    { studentName: "Claire Moreau", grade: 18.0, evaluation: "Devoir Maison", date: "2024-01-22" },
    { studentName: "David Bernard", grade: 12.5, evaluation: "Interrogation", date: "2024-01-29" },
  ])

  const overallAverage = evaluations.reduce((sum, evaluation) => sum + evaluation.average, 0) / evaluations.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{subjectData.name}</h2>
          <p className="text-muted-foreground">Classe: {subjectData.className} • Coefficient: {subjectData.coefficient}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">Réalisées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallAverage.toFixed(1)}/20</div>
            <p className="text-xs text-muted-foreground">Toutes évaluations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coefficient</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{subjectData.coefficient}</div>
            <p className="text-xs text-muted-foreground">Poids dans la moyenne</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Dans la classe</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle>Évaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Étudiants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.type}</TableCell>
                    <TableCell>{new Date(evaluation.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          evaluation.average >= 16 ? "default" : 
                          evaluation.average >= 12 ? "secondary" : 
                          "destructive"
                        }
                      >
                        {evaluation.average}/20
                      </Badge>
                    </TableCell>
                    <TableCell>{evaluation.students}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Notes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Évaluation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGrades.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{grade.studentName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          grade.grade >= 16 ? "default" : 
                          grade.grade >= 12 ? "secondary" : 
                          "destructive"
                        }
                      >
                        {grade.grade}/20
                      </Badge>
                    </TableCell>
                    <TableCell>{grade.evaluation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}