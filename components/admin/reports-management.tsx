"use client"

import { useState } from "react"
import { BarChart3, Download, FileText, Loader2, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ClassSelect, EvaluationSelect, ErrorState, SectionHeader } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { runAction } from "@/hooks/useAsync"
import { useClasses } from "@/hooks/useClasses"
import { useEvaluations } from "@/hooks/useEvaluations"
import { exportApi } from "@/lib/transcript-api"

interface ExportCardProps {
  title: string
  description: string
  icon: LucideIcon
  disabled: boolean
  disabledHint?: string
  busy: boolean
  onClick: () => void
}

function ExportCard({ title, description, icon: Icon, disabled, disabledHint, busy, onClick }: ExportCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" aria-hidden />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full" onClick={onClick} disabled={disabled || busy}>
          {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {busy ? "Téléchargement..." : "Exporter (.xlsx)"}
        </Button>
        {disabled && disabledHint && <p className="text-xs text-muted-foreground">{disabledHint}</p>}
      </CardContent>
    </Card>
  )
}

export function ReportsManagement() {
  const { evaluations, error: evaluationsError } = useEvaluations()
  const { classes, error, reload } = useClasses()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedEvaluation, setSelectedEvaluation] = useState("")
  const [downloading, setDownloading] = useState<string | null>(null)

  const schoolClass = classes.find((c) => String(c.id) === selectedClass)
  const evaluationId = selectedEvaluation ? Number(selectedEvaluation) : null

  const download = async (key: string, action: () => Promise<void>) => {
    setDownloading(key)
    await runAction(action, "Export téléchargé", "Erreur lors de l'export")
    setDownloading(null)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Exports Excel" description="Exportez les listes et les résultats de l'établissement" />

      {(error || evaluationsError) && <ErrorState message={error || evaluationsError || ""} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-class">Classe</Label>
              <ClassSelect id="report-class" classes={classes} value={selectedClass} onChange={setSelectedClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-evaluation">Évaluation</Label>
              <EvaluationSelect
                id="report-evaluation"
                evaluations={evaluations}
                value={selectedEvaluation}
                onChange={setSelectedEvaluation}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExportCard
          title="Liste des étudiants"
          description="Étudiants d'une classe avec leur matricule"
          icon={Users}
          disabled={!schoolClass}
          disabledHint="Sélectionnez une classe."
          busy={downloading === "students"}
          onClick={() => schoolClass && download("students", () => exportApi.studentsOfClass(schoolClass.id, schoolClass.className))}
        />
        <ExportCard
          title="Liste des enseignants"
          description="Tous les enseignants et leurs matières"
          icon={Users}
          disabled={false}
          busy={downloading === "teachers"}
          onClick={() => download("teachers", () => exportApi.teachers())}
        />
        <ExportCard
          title="Statistiques"
          description="Moyennes par matière et classement d'une classe pour une évaluation"
          icon={BarChart3}
          disabled={!schoolClass || !evaluationId}
          disabledHint="Sélectionnez une classe et une évaluation."
          busy={downloading === "statistics"}
          onClick={() =>
            schoolClass &&
            evaluationId &&
            download("statistics", () => exportApi.statistics(schoolClass.id, evaluationId, schoolClass.className))
          }
        />
        <ExportCard
          title="Rapport complet"
          description="Liste des étudiants et statistiques dans un même classeur"
          icon={FileText}
          disabled={!schoolClass || !evaluationId}
          disabledHint="Sélectionnez une classe et une évaluation."
          busy={downloading === "complete"}
          onClick={() =>
            schoolClass &&
            evaluationId &&
            download("complete", () => exportApi.complete(schoolClass.id, evaluationId, schoolClass.className))
          }
        />
      </div>
    </div>
  )
}
