"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, BookOpen } from "lucide-react"

const subjects = [
  { id: 1, name: "Mathématiques", code: "MATH", coefficient: 4, students: 320, teachers: 8, average: 14.2 },
  { id: 2, name: "Physique", code: "PHYS", coefficient: 3, students: 280, teachers: 6, average: 13.8 },
  { id: 3, name: "Chimie", code: "CHIM", coefficient: 3, students: 260, teachers: 5, average: 14.5 },
  { id: 4, name: "Français", code: "FR", coefficient: 4, students: 400, teachers: 10, average: 13.2 },
  { id: 5, name: "Anglais", code: "ANG", coefficient: 3, students: 380, teachers: 8, average: 15.1 },
  { id: 6, name: "Histoire-Géographie", code: "HG", coefficient: 3, students: 350, teachers: 7, average: 13.9 },
]

export function SubjectManagement() {
  const [isAddingSubject, setIsAddingSubject] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Matières</h2>
          <p className="text-muted-foreground">Configuration des matières et coefficients</p>
        </div>
        <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouvelle Matière</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Matière</DialogTitle>
              <DialogDescription>Ajoutez une nouvelle matière au système</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Nom de la matière</Label>
                <Input id="subjectName" placeholder="Ex: Mathématiques" />
              </div>
              <div>
                <Label htmlFor="subjectCode">Code matière</Label>
                <Input id="subjectCode" placeholder="Ex: MATH" />
              </div>
              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input id="coefficient" type="number" min="1" max="10" placeholder="Ex: 4" />
              </div>
              <Button className="w-full" onClick={() => setIsAddingSubject(false)}>
                Créer la Matière
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matières</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants Inscrits</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.reduce((sum, s) => sum + s.students, 0)}</div>
            <p className="text-xs text-muted-foreground">Total inscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.reduce((sum, s) => sum + s.teachers, 0)}</div>
            <p className="text-xs text-muted-foreground">Assignés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(subjects.reduce((sum, s) => sum + s.average, 0) / subjects.length).toFixed(1)}/20
            </div>
            <p className="text-xs text-muted-foreground">Toutes matières</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Matières</CardTitle>
          <CardDescription>Gérez les matières, coefficients et assignations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Enseignants</TableHead>
                <TableHead>Moyenne</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subject.code}</Badge>
                  </TableCell>
                  <TableCell>{subject.coefficient}</TableCell>
                  <TableCell>{subject.students}</TableCell>
                  <TableCell>{subject.teachers}</TableCell>
                  <TableCell>
                    <Badge variant={subject.average >= 14 ? "default" : "secondary"}>{subject.average}/20</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
