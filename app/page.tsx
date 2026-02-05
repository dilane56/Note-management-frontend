"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/login-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, GraduationCap, BookOpen, Settings, LogOut } from "lucide-react"
import { StudentDashboard } from "@/components/student-dashboard"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function GradeManagementSystem() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl mx-auto">
            <BarChart3 className="w-8 h-8 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const roleConfig = {
    student: {
      title: "Tableau de Bord Étudiant",
      description: "Consultez vos notes et suivez vos progrès",
      icon: GraduationCap,
      color: "bg-chart-1",
    },
    teacher: {
      title: "Interface Enseignant",
      description: "Gérez les notes et suivez les performances de vos classes",
      icon: BookOpen,
      color: "bg-chart-2",
    },
    admin: {
      title: "Administration",
      description: "Gérez le système et générez des rapports",
      icon: Settings,
      color: "bg-chart-4",
    },
  }

  const currentConfig = roleConfig[user.role]
  const IconComponent = currentConfig.icon

  const renderDashboard = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard />
      case "teacher":
        return <TeacherDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EduGrades</h1>
                <p className="text-sm text-muted-foreground">Système de Gestion des Notes</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <IconComponent className="w-3 h-3" />
                <span className="capitalize">{user.role}</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IconComponent className="w-5 h-5" />
              <span>{currentConfig.title}</span>
            </CardTitle>
            <CardDescription>{currentConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>{renderDashboard()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
