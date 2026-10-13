"use client"

import { useEffect, useState } from "react"
import { BarChart3, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { AdminDashboard } from "@/components/admin-dashboard"
import { LoginPage } from "@/components/login-page"
import { NAV_ITEMS, Navigation } from "@/components/navigation"
import { StudentDashboard } from "@/components/student-dashboard"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { roleLabel } from "@/lib/format"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Passer au thème clair" : "Passer au thème sombre"}
      title={dark ? "Thème clair" : "Thème sombre"}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

export default function GradeManagementSystem() {
  const { user, logout, isLoading } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")

  // Retour au tableau de bord à chaque changement d'utilisateur.
  useEffect(() => {
    setActiveSection("dashboard")
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4" role="status">
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

  const section = NAV_ITEMS[user.role].some((item) => item.id === activeSection) ? activeSection : "dashboard"

  const renderDashboard = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard section={section} />
      case "teacher":
        return <TeacherDashboard section={section} onNavigate={setActiveSection} />
      case "admin":
        return <AdminDashboard section={section} onNavigate={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shrink-0">
              <BarChart3 className="w-6 h-6 text-primary-foreground" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground">EduGrades</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Système de gestion des notes</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary">{roleLabel(user.role)}</Badge>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => logout()} aria-label="Se déconnecter">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="md:flex">
        <Navigation role={user.role} activeSection={section} onSectionChange={setActiveSection} />
        <main className="flex-1 min-w-0 p-4 md:p-6">{renderDashboard()}</main>
      </div>
    </div>
  )
}
