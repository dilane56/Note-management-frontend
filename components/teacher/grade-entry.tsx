"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Save, Search } from "lucide-react"

const classes = [
  { id: 1, name: "Terminale S1", students: 28, subject: "Mathématiques" },
  { id: 2, name: "Première S2", students: 25, subject: "Mathématiques" },
  { id: 3, name: "Seconde A", students: 30, subject: "Mathématiques" },
]

const studentsData = [
  { id: 1, name: "Alice Martin", grade: 16.5, coefficient: 3, comment: "Excellent travail", lastUpdate: "2024-01-15" },
  { id: 2, name: "Bob Dupont", grade: 14.2, coefficient: 3, comment: "Bon niveau", lastUpdate: "2024-01-14" },
  { id: 3, name: "Claire Moreau", grade: 18.0, coefficient: 3, comment: "Remarquable", lastUpdate: "2024-01-16" },
  { id: 4, name: "David Bernard", grade: 12.5, coefficient: 3, comment: "Peut mieux faire", lastUpdate: "2024-01-13" },
  { id: 5, name: "Emma Petit", grade: 15.8, coefficient: 3, comment: "Très bien", lastUpdate: "2024-01-15" },
  { id: 6, name: "François Leroy", grade: 13.2, coefficient: 3, comment: "Correct", lastUpdate: "2024-01-12" },
]

export function GradeEntry() {
  const [selectedClass, setSelectedClass] = useState("Terminale S1")
  const [isAddingGrade, setIsAddingGrade] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newGrade, setNewGrade] = useState({ student: "", grade: "", comment: "", coefficient: "3" })

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saisie des Notes</h2>
          <p className="text-muted-foreground">Gérez les notes de vos étudiants</p>
        </div>
        <Dialog open={isAddingGrade} onOpenChange={setIsAddingGrade}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Ajouter Note</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle Note</DialogTitle>
              <DialogDescription>Saisissez une nouvelle note pour un étudiant</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Étudiant</Label>
                <Select
                  value={newGrade.student}
                  onValueChange={(value) => setNewGrade({ ...newGrade, student: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un étudiant" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsData.map((student) => (
                      <SelectItem key={student.id} value={student.name}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade">Note (/20)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={newGrade.grade}
                  onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <Select
                  value={newGrade.coefficient}
                  onValueChange={(value) => setNewGrade({ ...newGrade, coefficient: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comment">Commentaire</Label>
                <Textarea
                  id="comment"
                  value={newGrade.comment}
                  onChange={(e) => setNewGrade({ ...newGrade, comment: e.target.value })}
                  placeholder="Commentaire sur la copie..."
                />
              </div>
              <Button className="w-full" onClick={() => setIsAddingGrade(false)}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Class Selection and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="class-select">Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.name} value={cls.name}>
                      {cls.name} ({cls.students} étudiants)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="search">Rechercher un étudiant</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom de l'étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notes - {selectedClass}</CardTitle>
          <CardDescription>Liste des étudiants et leurs notes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Dernière MAJ</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.grade >= 16 ? "default" : student.grade >= 12 ? "secondary" : "destructive"}
                    >
                      {student.grade}/20
                    </Badge>
                  </TableCell>
                  <TableCell>{student.coefficient}</TableCell>
                  <TableCell className="max-w-xs truncate">{student.comment}</TableCell>
                  <TableCell>{new Date(student.lastUpdate).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
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
