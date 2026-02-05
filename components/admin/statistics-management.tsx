"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, BookOpen, TrendingUp, Award, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useEvaluations } from "@/hooks/useEvaluations"

export function StatisticsManagement() {
  const { evaluations } = useEvaluations()
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("")
  const [classStats, setClassStats] = useState<any>(null)
  const [subjectStats, setSubjectStats] = useState<any[]>([])
  const [studentStats, setStudentStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)

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

  useEffect(() => {
    if (selectedClass && selectedEvaluation) {
      fetchStatistics()
    }
  }, [selectedClass, selectedEvaluation])

  const fetchStatistics = async () => {
    setStatsLoading(true)
    try {
      const [classData, subjectsData, studentsData] = await Promise.all([
        api.get(`/api/statistics/class/${selectedClass}/evaluation/${selectedEvaluation}`),
        api.get(`/api/statistics/subjects/class/${selectedClass}/evaluation/${selectedEvaluation}`),
        api.get(`/api/statistics/students/class/${selectedClass}/evaluation/${selectedEvaluation}`)
      ])
      
      setClassStats(classData)
      setSubjectStats(subjectsData)
      setStudentStats(studentsData)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const selectedClassName = classes.find(c => c.id.toString() === selectedClass)?.className;
  const selectedEvaluationName = evaluations.find(e => e.id.toString() === selectedEvaluation)?.typeEvaluation;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Statistiques</h2>
        <p className="text-muted-foreground">Consultez les performances par classe et évaluation</p>
      </div>

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

      {selectedClass && selectedEvaluation && (
        <>
          {statsLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Chargement des statistiques...
              </CardContent>
            </Card>
          ) : (
            <>
              {classStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Moyenne Classe</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{classStats.classAverage?.toFixed(1) || classStats.moyenneClasse?.toFixed(1) || '-'}/20</div>
                      <p className="text-xs text-muted-foreground">{selectedClassName}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Note la plus haute</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{classStats.highestGrade || classStats.noteLaPlusHaute || '-'}/20</div>
                      <p className="text-xs text-muted-foreground">Maximum</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{classStats.totalStudents || classStats.nombreTotalEtudiants || '-'}</div>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Au-dessus moyenne</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">{classStats.studentsAboveAverage || classStats.etudiantsAuDessusMoyenne || '-'}</div>
                      <p className="text-xs text-muted-foreground">Étudiants</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Statistiques par Matière
                    </CardTitle>
                    <CardDescription>{selectedEvaluationName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matière</TableHead>
                          <TableHead>Moyenne</TableHead>
                          <TableHead>Coef.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjectStats.map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{subject.subjectName || subject.nomMatiere}</TableCell>
                            <TableCell>
                              <Badge variant={(subject.subjectAverage || subject.moyenneMatiere) >= 12 ? "default" : "destructive"}>
                                {(subject.subjectAverage || subject.moyenneMatiere)?.toFixed(1)}/20
                              </Badge>
                            </TableCell>
                            <TableCell>{subject.coefficient || subject.coefficientMatiere}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Classement des Étudiants
                    </CardTitle>
                    <CardDescription>Top 10</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rang</TableHead>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Moyenne</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentStats.slice(0, 10).map((student, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant={student.rank <= 3 ? "default" : "outline"}>
                                #{student.rank}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.studentName}
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.average >= 12 ? "default" : "destructive"}>
                                {student.average?.toFixed(1)}/20
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}

      {!selectedClass || !selectedEvaluation ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
            Sélectionnez une classe et une évaluation pour voir les statistiques
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}