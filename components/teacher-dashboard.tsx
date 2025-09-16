"use client"

import { useState, useEffect } from "react"
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
import { MySubjects } from "./teacher/my-subjects"
import { MyClasses } from "./teacher/my-classes"
import { useAuth } from "@/contexts/auth-context"
import { getTeacherClasses } from "@/lib/teacher-api"
import { getTeacherSubjects } from "@/lib/teacher-api"



export function TeacherDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const [classesData, subjectsData] = await Promise.all([
          getTeacherClasses(user.id),
          getTeacherSubjects(user.id)
        ])
        setClasses(classesData)
        setSubjects(subjectsData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [user])

  const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0)
  const totalClasses = classes.length
  const totalSubjects = subjects.length

  const renderContent = () => {
    switch (activeSection) {
      case "grades":
        return <GradeEntry />
      case "my-subjects":
        return <MySubjects />
      case "my-classes":
        return <MyClasses />
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
                  <div className="text-2xl font-bold">{totalClasses}</div>
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
                  <div className="text-2xl font-bold text-primary">-</div>
                  <p className="text-xs text-muted-foreground">Calcul en cours</p>
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

            {/* Actions rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveSection("grades")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Saisir des Notes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setActiveSection("my-subjects")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Mes Matières ({totalSubjects})
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setActiveSection("my-classes")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Mes Classes ({totalClasses})
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                  <CardDescription>Aperçu de vos données</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Classes assignées:</span>
                      <span className="font-bold">{totalClasses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Matières enseignées:</span>
                      <span className="font-bold">{totalSubjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total étudiants:</span>
                      <span className="font-bold">{totalStudents}</span>
                    </div>
                  </div>
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
                  {loading ? (
                    <div className="col-span-3 text-center py-4">Chargement...</div>
                  ) : classes.length > 0 ? (
                    classes.map((cls) => (
                      <Card key={cls.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{cls.className}</CardTitle>
                          <CardDescription>{cls.filiereName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Étudiants:</span>
                              <span className="font-medium">{cls.students?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Moyenne:</span>
                              <span className="font-medium text-primary">-</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4 bg-transparent" 
                            size="sm"
                            onClick={() => setActiveSection("my-classes")}
                          >
                            Voir Détails
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-4 text-muted-foreground">
                      Aucune classe assignée
                    </div>
                  )}
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
