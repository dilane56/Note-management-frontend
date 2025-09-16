"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Users, TrendingUp, BookOpen } from "lucide-react"
import { ClassResponseDTO } from "@/lib/class-api"

interface ClassDetailsProps {
  classData: ClassResponseDTO
  onBack: () => void
}

export function ClassDetails({ classData, onBack }: ClassDetailsProps) {
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Martin", average: 16.5, status: "Excellent" },
    { id: 2, name: "Bob Dupont", average: 14.2, status: "Bien" },
    { id: 3, name: "Claire Moreau", average: 18.0, status: "Excellent" },
    { id: 4, name: "David Bernard", average: 12.5, status: "Passable" },
    { id: 5, name: "Emma Petit", average: 15.8, status: "Bien" },
  ])

  const classAverage = students.reduce((sum, student) => sum + student.average, 0) / students.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{classData.name}</h2>
          <p className="text-muted-foreground">Détails de la classe</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Inscrits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Classe</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{classAverage.toFixed(1)}/20</div>
            <p className="text-xs text-muted-foreground">Toutes matières</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {Math.round((students.filter(s => s.average >= 10).length / students.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">≥ 10/20</p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Moyenne</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.average >= 16 ? "default" : 
                        student.average >= 12 ? "secondary" : 
                        "destructive"
                      }
                    >
                      {student.average}/20
                    </Badge>
                  </TableCell>
                  <TableCell>{student.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Voir Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}