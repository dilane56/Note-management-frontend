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
import { useState, useEffect } from "react"
import { Navigation } from "./navigation"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { UserManagement } from "./admin/user-management"
import { SubjectManagement } from "./admin/subject-management"
import { FiliereManagement } from "./admin/filiere-management"
import { ClassManagement } from "./admin/class-management"
import { EvaluationManagement } from "./admin/evaluation-management"
import { TranscriptManagement } from "./admin/transcript-management"
import { ReportsManagement } from "./admin/reports-management"
import { StatisticsManagement } from "./admin/statistics-management"

export function AdminDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
    recentUsers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [users, subjects, classes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/subjects'),
          api.get('/api/classes')
        ])
        
        const students = users.filter((u: any) => u.role === 'STUDENT')
        const teachers = users.filter((u: any) => u.role === 'TEACHER')
        const recentUsers = users.slice(-4).map((u: any) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role === 'STUDENT' ? 'Étudiant' : u.role === 'TEACHER' ? 'Enseignant' : 'Admin',
          status: 'Actif'
        }))
        
        setDashboardData({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalSubjects: subjects.length,
          totalClasses: classes.length,
          recentUsers
        })
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

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
      case "evaluations":
        return <EvaluationManagement />
      case "transcripts":
        return <TranscriptManagement />
      case "reports":
        return <ReportsManagement />
      case "statistics":
        return <StatisticsManagement />
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
                  <div className="text-2xl font-bold">{dashboardData.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Inscrits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Actifs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matières</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalSubjects}</div>
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">-</div>
                  <p className="text-xs text-muted-foreground">Calcul en cours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{dashboardData.totalClasses}</div>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Accès direct aux fonctionnalités de gestion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setActiveSection("users")}
                  >
                    <Users className="w-6 h-6" />
                    <span>Utilisateurs</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setActiveSection("subjects")}
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>Matières</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setActiveSection("classes")}
                  >
                    <Settings className="w-6 h-6" />
                    <span>Classes</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setActiveSection("evaluations")}
                  >
                    <FileText className="w-6 h-6" />
                    <span>Évaluations</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            Chargement...
                          </TableCell>
                        </TableRow>
                      ) : dashboardData.recentUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            Aucun utilisateur récent
                          </TableCell>
                        </TableRow>
                      ) : (
                        dashboardData.recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "Actif" ? "default" : "secondary"}>{user.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
