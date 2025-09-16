"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Users, BarChart3, FileText, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useEvaluations } from "@/hooks/useEvaluations"
import { toast } from "sonner"

export function ReportsManagement() {
  const { token } = useAuth()
  const { evaluations } = useEvaluations()
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true)
        const classesData = await api.get('/api/classes')
        setClasses(classesData)
      } catch (error) {
        console.error('Erreur lors du chargement des classes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchClasses()
  }, [])

  const downloadFile = async (endpoint: string, filename: string, type: string) => {
    setDownloading(type)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Export téléchargé avec succès')
      } else {
        toast.error('Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setDownloading(null)
    }
  }

  const handleStudentsExport = () => {
    if (!selectedClass) {
      toast.error('Veuillez sélectionner une classe')
      return
    }
    const className = classes.find(c => c.id.toString() === selectedClass)?.className || 'classe'
    downloadFile(
      `/api/exports/students/class/${selectedClass}`,
      `etudiants-${className}.xlsx`,
      'students'
    )
  }

  const handleTeachersExport = () => {
    downloadFile(
      '/api/exports/teachers',
      'enseignants.xlsx',
      'teachers'
    )
  }

  const handleStatisticsExport = () => {
    if (!selectedClass || !selectedEvaluation) {
      toast.error('Veuillez sélectionner une classe et une évaluation')
      return
    }
    const className = classes.find(c => c.id.toString() === selectedClass)?.className || 'classe'
    const evaluationName = evaluations.find(e => e.id.toString() === selectedEvaluation)?.typeEvaluation || 'evaluation'
    downloadFile(
      `/api/exports/statistics/class/${selectedClass}/evaluation/${selectedEvaluation}`,
      `statistiques-${className}-${evaluationName}.xlsx`,
      'statistics'
    )
  }

  const handleCompleteExport = () => {
    if (!selectedClass || !selectedEvaluation) {
      toast.error('Veuillez sélectionner une classe et une évaluation')
      return
    }
    const className = classes.find(c => c.id.toString() === selectedClass)?.className || 'classe'
    const evaluationName = evaluations.find(e => e.id.toString() === selectedEvaluation)?.typeEvaluation || 'evaluation'
    downloadFile(
      `/api/exports/complete/class/${selectedClass}/evaluation/${selectedEvaluation}`,
      `rapport-complet-${className}-${evaluationName}.xlsx`,
      'complete'
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rapports et Exports</h2>
        <p className="text-muted-foreground">Exportez les données de l'établissement</p>
      </div>

      {/* Sélecteurs */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classe) => (
                    <SelectItem key={classe.id} value={classe.id.toString()}>
                      {classe.className} - {classe.filiereName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Évaluation</label>
              <Select value={selectedEvaluation} onValueChange={setSelectedEvaluation}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une évaluation" />
                </SelectTrigger>
                <SelectContent>
                  {evaluations.map((evaluation) => (
                    <SelectItem key={evaluation.id} value={evaluation.id.toString()}>
                      {evaluation.name} ({evaluation.typeEvaluation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Étudiants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Liste des Étudiants
            </CardTitle>
            <CardDescription>
              Exporter la liste des étudiants d'une classe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={handleStudentsExport}
              disabled={!selectedClass || downloading === 'students'}
            >
              {downloading === 'students' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter Étudiants
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Enseignants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Liste des Enseignants
            </CardTitle>
            <CardDescription>
              Exporter la liste complète des enseignants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={handleTeachersExport}
              disabled={downloading === 'teachers'}
            >
              {downloading === 'teachers' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter Enseignants
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Statistiques
            </CardTitle>
            <CardDescription>
              Exporter les statistiques d'une classe pour une évaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={handleStatisticsExport}
              disabled={!selectedClass || !selectedEvaluation || downloading === 'statistics'}
            >
              {downloading === 'statistics' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter Statistiques
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Complet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Rapport Complet
            </CardTitle>
            <CardDescription>
              Exporter toutes les données (liste + statistiques)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={handleCompleteExport}
              disabled={!selectedClass || !selectedEvaluation || downloading === 'complete'}
            >
              {downloading === 'complete' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter Rapport Complet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}