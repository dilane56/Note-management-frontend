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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Plus, Edit, Save, Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import { Navigation } from "./navigation"
import { GradeEntry } from "./teacher/grade-entry"

const classData = [
  { name: "Terminale S1", students: 28, average: 14.2, subject: "Mathématiques" },
  { name: "Première S2", students: 25, average: 13.8, subject: "Mathématiques" },
  { name: "Seconde A", students: 30, average: 12.5, subject: "Mathématiques" },
]

const studentsData = [
  { id: 1, name: "Alice Martin", grade: 16.5, coefficient: 3, comment: "Excellent travail" },
  { id: 2, name: "Bob Dupont", grade: 14.2, coefficient: 3, comment: "Bon niveau" },
  { id: 3, name: "Claire Moreau", grade: 18.0, coefficient: 3, comment: "Remarquable" },
  { id: 4, name: "David Bernard", grade: 12.5, coefficient: 3, comment: "Peut mieux faire" },
  { id: 5, name: "Emma Petit", grade: 15.8, coefficient: 3, comment: "Très bien" },
]

const performanceData = [
  { class: "Term S1", average: 14.2, passing: 85 },
  { class: "1ère S2", average: 13.8, passing: 80 },
  { class: "2nde A", average: 12.5, passing: 75 },
]

export function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [selectedClass, setSelectedClass] = useState("Terminale S1")
  const [isAddingGrade, setIsAddingGrade] = useState(false)
  const [newGrade, setNewGrade] = useState({ student: "", grade: "", comment: "" })

  const totalStudents = classData.reduce((sum, cls) => sum + cls.students, 0)
  const overallAverage = classData.reduce((sum, cls) => sum + cls.average, 0) / classData.length

  const renderContent = () => {
    switch (activeSection) {
      case "grades":
        return <GradeEntry />
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classData.length}</div>
                  <p className="text-xs text-muted-foreground">Assignées</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Au total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{overallAverage.toFixed(1)}/20</div>
                  <p className="text-xs text-muted-foreground">Toutes classes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">80%</div>
                  <p className="text-xs text-muted-foreground">≥ 10/20</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grade Entry */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Saisie des Notes</CardTitle>
                    <CardDescription>Classe sélectionnée: {selectedClass}</CardDescription>
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {classData.map((cls) => (
                          <SelectItem key={cls.name} value={cls.name}>
                            {cls.name} ({cls.students} étudiants)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsData.slice(0, 5).map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  student.grade >= 16 ? "default" : student.grade >= 12 ? "secondary" : "destructive"
                                }
                              >
                                {student.grade}/20
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Class Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance des Classes</CardTitle>
                  <CardDescription>Moyennes et taux de réussite</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="average" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* My Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Classes</CardTitle>
                <CardDescription>Vue d'ensemble de toutes vos classes assignées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classData.map((cls, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{cls.name}</CardTitle>
                        <CardDescription>{cls.subject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Étudiants:</span>
                            <span className="font-medium">{cls.students}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Moyenne:</span>
                            <span className="font-medium text-primary">{cls.average}/20</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                          Voir Détails
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  )
}
