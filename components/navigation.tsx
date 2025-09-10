"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  Users,
  BookOpen,
  FileText,
  Settings,
  TrendingUp,
  GraduationCap,
  BarChart3,
  ClipboardList,
  Calendar,
  Home,
  LogOut,
  Building2,
  School,
} from "lucide-react"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const { user, logout } = useAuth()

  const getNavigationItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { id: "dashboard", label: "Tableau de Bord", icon: Home },
          { id: "users", label: "Gestion des Utilisateurs", icon: Users },
          { id: "filieres", label: "Gestion des Filières", icon: Building2 },
          { id: "classes", label: "Gestion des Classes", icon: School },
          { id: "subjects", label: "Gestion des Matières", icon: BookOpen },
          { id: "reports", label: "Rapports et Exports", icon: FileText },
          { id: "statistics", label: "Statistiques", icon: TrendingUp },
          { id: "settings", label: "Paramètres Système", icon: Settings },
        ]
      case "teacher":
        return [
          { id: "dashboard", label: "Tableau de Bord", icon: Home },
          { id: "grades", label: "Saisie des Notes", icon: ClipboardList },
          { id: "classes", label: "Mes Classes", icon: GraduationCap },
          { id: "performance", label: "Performance Classes", icon: BarChart3 },
          { id: "schedule", label: "Planning", icon: Calendar },
        ]
      case "student":
        return [
          { id: "dashboard", label: "Tableau de Bord", icon: Home },
          { id: "grades", label: "Mes Notes", icon: BarChart3 },
          { id: "reports", label: "Bulletins", icon: FileText },
          { id: "schedule", label: "Emploi du Temps", icon: Calendar },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Notes Manager</h2>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">{user?.name}</p>
          <Badge variant="outline" className="mt-1">
            {user?.role === "admin" ? "Administrateur" : user?.role === "teacher" ? "Enseignant" : "Étudiant"}
          </Badge>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
