"use client"

import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpen,
  Building2,
  CheckSquare,
  ClipboardList,
  FileDown,
  FileText,
  GraduationCap,
  Home,
  School,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserRole } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "filieres", label: "Filières", icon: Building2 },
    { id: "classes", label: "Classes", icon: School },
    { id: "subjects", label: "Matières", icon: BookOpen },
    { id: "evaluations", label: "Évaluations", icon: CheckSquare },
    { id: "transcripts", label: "Relevés de notes", icon: FileText },
    { id: "reports", label: "Exports Excel", icon: FileDown },
    { id: "statistics", label: "Statistiques", icon: TrendingUp },
  ],
  teacher: [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "grades", label: "Saisie des notes", icon: ClipboardList },
    { id: "my-subjects", label: "Mes matières", icon: BookOpen },
    { id: "my-classes", label: "Mes classes", icon: GraduationCap },
  ],
  student: [
    { id: "dashboard", label: "Mes notes", icon: BarChart3 },
    { id: "transcripts", label: "Relevés et exports", icon: FileText },
  ],
}

interface NavigationProps {
  role: UserRole
  activeSection: string
  onSectionChange: (section: string) => void
}

/** Barre latérale sur grand écran, barre d'onglets défilante sur mobile. */
export function Navigation({ role, activeSection, onSectionChange }: NavigationProps) {
  const items = NAV_ITEMS[role]

  return (
    <nav aria-label="Navigation principale" className="md:w-60 md:shrink-0 md:border-r md:bg-card md:min-h-[calc(100vh-73px)]">
      <ul className="flex gap-1 overflow-x-auto border-b bg-card px-2 py-2 md:flex-col md:overflow-visible md:border-b-0 md:p-4 md:sticky md:top-[73px]">
        {items.map((item) => {
          const Icon = item.icon
          const active = activeSection === item.id
          return (
            <li key={item.id} className="shrink-0">
              <Button
                variant={active ? "default" : "ghost"}
                className={cn("w-full justify-start", !active && "text-muted-foreground")}
                aria-current={active ? "page" : undefined}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-2" aria-hidden />
                {item.label}
              </Button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
