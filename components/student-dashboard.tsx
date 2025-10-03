"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, BookOpen, Award } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useEvaluations } from "@/hooks/useEvaluations"

export function StudentDashboard() {
  const { user, token } = useAuth()
  const { evaluations } = useEvaluations()
  const [studentGrades, setStudentGrades] = useState<any[]>([])
  const [filteredGrades, setFilteredGrades] = useState<any[]>([])
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("all")
  const [ranking, setRanking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentGrades = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const [grades, rankingData] = await Promise.all([
          api.get(`/api/grades/students/${user.id}/grades`),
          api.get(`/api/students/${user.id}/ranking`)
        ])
        setStudentGrades(grades)
        setFilteredGrades(grades)
        setRanking(rankingData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStudentGrades()
  }, [user])

  useEffect(() => {
    if (selectedEvaluation === "all") {
      setFilteredGrades(studentGrades)
    } else {
      setFilteredGrades(studentGrades.filter(grade => 
        grade.evaluation.id.toString() === selectedEvaluation
      ))
    }
  }, [selectedEvaluation, studentGrades])

  const downloadTranscript = async () => {
    if (!user?.id || !selectedEvaluation) {
      toast.error('Veuillez sélectionner une évaluation')
      return
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transcripts/students/${user.id}/evaluations/${selectedEvaluation}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `releve-notes-${user.firstName}-${user.lastName}-evaluation-${selectedEvaluation}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Relevé téléchargé avec succès')
      } else {
        toast.error('Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error('Erreur lors du téléchargement')
    }
  }

  const overallAverage = ranking?.studentAverage || (
    filteredGrades.length > 0
      ? filteredGrades.reduce((sum, item) => sum + item.noteValue, 0) / filteredGrades.length
      : 0
  )

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {overallAverage > 0 ? `${overallAverage.toFixed(2)}/20` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredGrades.length} note(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matières</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredGrades.length}</div>
            <p className="text-xs text-muted-foreground">Évaluées ce semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rang</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ranking ? `${ranking.studentRank}/${ranking.totalStudents}` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Dans la classe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Classe</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {ranking ? `${parseFloat(ranking.classAverage).toFixed(2)}/20` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Moyenne générale</p>
          </CardContent>
        </Card>
      </div>

      {/* Grades by Subject */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notes par Matière</CardTitle>
            <CardDescription>Filtrer par évaluation</CardDescription>
          </div>
          <Select value={selectedEvaluation} onValueChange={setSelectedEvaluation}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les évaluations</SelectItem>
              {evaluations.map((evaluation) => (
                <SelectItem key={evaluation.id} value={evaluation.id.toString()}>
                  {evaluation.name} ({evaluation.typeEvaluation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement des notes...</div>
          ) : filteredGrades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {selectedEvaluation === "all" ? "Aucune note disponible" : "Aucune note pour cette évaluation"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGrades.map((grade, index) => {
                const colors = [
                  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", 
                  "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-red-500", "bg-yellow-500"
                ]
                const colorIndex = index % colors.length
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[colorIndex]}`} />
                      <span className="font-medium text-base">{grade.subjectName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {grade.evaluation.type}
                      </Badge>
                      {grade.comment && grade.comment !== "RAS" && (
                        <Badge variant="outline" className="text-xs max-w-32 truncate" title={grade.comment}>
                          {grade.comment}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={grade.noteValue >= 16 ? "default" : grade.noteValue >= 12 ? "secondary" : "destructive"}
                        className="text-sm font-bold px-3 py-1"
                      >
                        {grade.noteValue}/20
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Télécharger Relevé de Notes</CardTitle>
          <CardDescription>Sélectionnez une évaluation pour télécharger votre relevé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            <Button 
              className="w-full flex items-center space-x-2" 
              onClick={downloadTranscript}
              disabled={!selectedEvaluation}
            >
              <Download className="w-4 h-4" />
              <span>Télécharger Relevé PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
