"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Plus, Download, Users, BookOpen, TrendingUp, Settings, FileText, UserPlus } from "lucide-react"
import { useState } from "react"
import { Navigation } from "./navigation"
import { UserManagement } from "./admin/user-management"
import { SubjectManagement } from "./admin/subject-management"
import { FiliereManagement } from "./admin/filiere-management"
import { ClassManagement } from "./admin/class-management"

const systemStats = {
  totalStudents: 1247,
  totalTeachers: 45,
  totalSubjects: 12,
  overallAverage: 14.3,
  passRate: 82.5,
}

const subjectData = [
  { name: "Mathématiques", students: 320, average: 14.2, teachers: 8 },
  { name: "Physique", students: 280, average: 13.8, teachers: 6 },
  { name: "Chimie", students: 260, average: 14.5, teachers: 5 },
  { name: "Français", students: 400, average: 13.2, teachers: 10 },
  { name: "Anglais", students: 380, average: 15.1, teachers: 8 },
]

const gradeDistribution = [
  { range: "16-20", count: 245, color: "#00bcd4" },
  { range: "14-16", count: 380, color: "#164e63" },
  { range: "12-14", count: 420, color: "#ecfeff" },
  { range: "10-12", count: 150, color: "#475569" },
  { range: "0-10", count: 52, color: "#be123c" },
]

const recentUsers = [
  { id: 1, name: "Marie Dubois", role: "Enseignant", subject: "Mathématiques", status: "Actif" },
  { id: 2, name: "Pierre Martin", role: "Étudiant", class: "Terminale S1", status: "Actif" },
  { id: 3, name: "Sophie Bernard", role: "Enseignant", subject: "Physique", status: "Inactif" },
  { id: 4, name: "Lucas Moreau", role: "Étudiant", class: "Première S2", status: "Actif" },
]

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />
      case "filieres":
        return <FiliereManagement />
      case "classes":
        return <ClassManagement />
      case "subjects":
        return <SubjectManagement />
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Inscrits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Actifs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matières</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalSubjects}</div>
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{systemStats.overallAverage}/20</div>
                  <p className="text-xs text-muted-foreground">Établissement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{systemStats.passRate}%</div>
                  <p className="text-xs text-muted-foreground">≥ 10/20</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance par Matière</CardTitle>
                  <CardDescription>Moyennes et effectifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="average" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Notes</CardTitle>
                  <CardDescription>Distribution générale des résultats</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ range, count }) => `${range}: ${count}`}
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Management Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                    <CardDescription>Derniers comptes créés</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Nouvel Utilisateur</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Créer un Utilisateur</DialogTitle>
                        <DialogDescription>Ajoutez un nouvel étudiant ou enseignant</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nom complet</Label>
                          <Input id="name" placeholder="Nom Prénom" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="email@exemple.com" />
                        </div>
                        <div>
                          <Label htmlFor="role">Rôle</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Étudiant</SelectItem>
                              <SelectItem value="teacher">Enseignant</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Créer le Compte</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Actif" ? "default" : "secondary"}>{user.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Reports & Export */}
              <Card>
                <CardHeader>
                  <CardTitle>Rapports et Exports</CardTitle>
                  <CardDescription>Générez des documents officiels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                        <Download className="w-4 h-4" />
                        <span>Relevés PDF</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                        <FileText className="w-4 h-4" />
                        <span>Export Excel</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                        <TrendingUp className="w-4 h-4" />
                        <span>Statistiques</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                        <Users className="w-4 h-4" />
                        <span>Liste Classes</span>
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Génération en Masse</h4>
                      <div className="space-y-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une classe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes les classes</SelectItem>
                            <SelectItem value="terminale">Terminale S1</SelectItem>
                            <SelectItem value="premiere">Première S2</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Générer Bulletins PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des Matières</CardTitle>
                  <CardDescription>Configuration des matières et coefficients</CardDescription>
                </div>
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Matière</span>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Étudiants</TableHead>
                      <TableHead>Enseignants</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectData.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>{subject.students}</TableCell>
                        <TableCell>{subject.teachers}</TableCell>
                        <TableCell>
                          <Badge variant={subject.average >= 14 ? "default" : "secondary"}>{subject.average}/20</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Modifier
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
