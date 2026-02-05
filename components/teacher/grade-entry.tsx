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
import { Plus, Save, Search, BookOpen, Users, Edit, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useGrades } from "@/hooks/useGrades"
import { useEvaluations } from "@/hooks/useEvaluations"
import { toast } from "sonner"

export function GradeEntry() {
  const { user } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState<number | null>(null)
  const [isAddingGrade, setIsAddingGrade] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newGrade, setNewGrade] = useState({ 
    gradeValue: "", 
    evaluationID: ""
  })
  const [gradeError, setGradeError] = useState("")
  const [isCommentingGrade, setIsCommentingGrade] = useState(false)
  const [commentingGrade, setCommentingGrade] = useState<any>(null)
  const [commentText, setCommentText] = useState("")

  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([])
  const [subjectStudents, setSubjectStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSubjectData, setSelectedSubjectData] = useState<any>(null)

  const { fetchTeacherSubjects, fetchStudentsBySubject, addGradeForSubject, fetchGradesBySubject, updateGrade, updateGradeComment } = useGrades()
  const { evaluations } = useEvaluations()

  useEffect(() => {
    if (user?.id) {
      loadTeacherSubjects()
    }
  }, [user])

  useEffect(() => {
    if (selectedSubject) {
      loadSubjectStudents()
      // Récupérer les données de la matière sélectionnée
      const subjectData = teacherSubjects.find(s => s.id === selectedSubject)
      setSelectedSubjectData(subjectData)
    } else {
      setSubjectStudents([])
      setSelectedSubjectData(null)
    }
  }, [selectedSubject, teacherSubjects])

  const loadTeacherSubjects = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const subjects = await fetchTeacherSubjects(user.id)
      setTeacherSubjects(subjects)
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjectStudents = async () => {
    if (!selectedSubject) return
    setLoading(true)
    try {
      const students = await fetchStudentsBySubject(selectedSubject)
      setSubjectStudents(students)
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = subjectStudents.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddGrade = async () => {
    if (!selectedSubject || !currentStudent || !newGrade.evaluationID || !newGrade.gradeValue) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Vérification de la note maximale
    if (gradeError) {
      toast.error(gradeError)
      return
    }

    try {
      const existingGrade = getStudentGradeForEvaluation(currentStudent, Number(newGrade.evaluationID))
      
      if (existingGrade) {
        // Mise à jour de la note existante
        await updateGrade(existingGrade.noteId, {
          studentID: currentStudent.id,
          SubjectID: selectedSubject,
          evaluationId: Number(newGrade.evaluationID),
          noteValue: Number(newGrade.gradeValue)
        })
        toast.success('Note mise à jour avec succès!')
      } else {
        // Ajout d'une nouvelle note
        await addGradeForSubject(selectedSubject, currentStudent.id, Number(newGrade.evaluationID), {
          noteValue: Number(newGrade.gradeValue)
        })
        toast.success('Note ajoutée avec succès!')
      }
      
      setIsAddingGrade(false)
      setNewGrade({ gradeValue: "", evaluationID: "" })
      setGradeError("")
      setCurrentStudent(null)
      // Recharger les étudiants avec leurs notes
      await loadSubjectStudents()
    } catch (error) {
      console.error('Erreur lors de l\'opération:', error)
      toast.error('Erreur lors de l\'opération')
    }
  }

  const openAddGradeModal = (student: any) => {
    setCurrentStudent(student)
    setGradeError("")
    const existingGrade = selectedEvaluation ? getStudentGradeForEvaluation(student, selectedEvaluation) : null
    if (existingGrade) {
      setNewGrade({
        gradeValue: existingGrade.noteValue.toString(),
        evaluationID: selectedEvaluation?.toString() || ""
      })
    } else {
      setNewGrade({ gradeValue: "", evaluationID: selectedEvaluation?.toString() || "" })
    }
    setIsAddingGrade(true)
  }

  const getStudentGradeForEvaluation = (student: any, evaluationId: number) => {
    return student.notes?.find((note: any) => 
      note.evaluationReponse.id === evaluationId && note.subjectId === selectedSubject
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saisie des Notes</h2>
          <p className="text-muted-foreground">Gérez les notes de vos étudiants</p>
        </div>
      </div>

      {/* Sélection matière et évaluation */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subject-select">Matière *</Label>
              <Select value={selectedSubject?.toString() || ""} onValueChange={(value) => setSelectedSubject(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une matière" />
                </SelectTrigger>
                <SelectContent>
                  {teacherSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="evaluation-filter">Filtrer par évaluation</Label>
              <Select value={selectedEvaluation?.toString() || "all"} onValueChange={(value) => setSelectedEvaluation(value === "all" ? null : Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les évaluations" />
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
            </div>
            <div>
              <Label htmlFor="search">Rechercher un étudiant</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom de l'étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des étudiants */}
      {selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Étudiants - {teacherSubjects.find(s => s.id === selectedSubject)?.name}
            </CardTitle>
            <CardDescription>
              {filteredStudents.length} étudiant(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Chargement des étudiants...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun étudiant trouvé pour cette matière
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Note ({selectedEvaluation ? evaluations.find(e => e.id === selectedEvaluation)?.name : 'Sélectionner évaluation'})</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const existingGrade = selectedEvaluation ? getStudentGradeForEvaluation(student, selectedEvaluation) : null
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.matricule || '-'}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {selectedEvaluation && existingGrade ? (
                            <div className="flex items-center gap-2">
                              <Badge variant={existingGrade.noteValue >= 16 ? "default" : existingGrade.noteValue >= 12 ? "secondary" : "destructive"}>
                                {existingGrade.noteValue}/20
                              </Badge>
                              {existingGrade.comment && (
                                <span className="text-xs text-muted-foreground truncate max-w-20" title={existingGrade.comment}>
                                  {existingGrade.comment}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {selectedEvaluation && existingGrade ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openAddGradeModal(student)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => openAddGradeModal(student)}
                                disabled={!selectedEvaluation}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Ajouter Note
                              </Button>
                            )}
                            {selectedEvaluation && existingGrade && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setCommentingGrade(existingGrade)
                                  setCommentText(existingGrade.comment || "")
                                  setIsCommentingGrade(true)
                                }}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal d'ajout de note */}
      <Dialog open={isAddingGrade} onOpenChange={setIsAddingGrade}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvaluation && currentStudent && getStudentGradeForEvaluation(currentStudent, selectedEvaluation) ? 'Modifier la Note' : 'Ajouter une Note'}
            </DialogTitle>
            <DialogDescription>
              {currentStudent && 
                `${selectedEvaluation && getStudentGradeForEvaluation(currentStudent, selectedEvaluation) ? 'Modifier' : 'Ajouter'} une note pour ${currentStudent.firstName} ${currentStudent.lastName}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="evaluation">Évaluation *</Label>
              <Select
                value={newGrade.evaluationID}
                onValueChange={(value) => setNewGrade({ ...newGrade, evaluationID: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une évaluation" />
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
            <div>
              <Label htmlFor="grade">Note (/{selectedSubjectData?.noteMaximale || 20}) *</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max={selectedSubjectData?.noteMaximale || 20}
                step="0.1"
                placeholder={`Ex: 15.5 (max: ${selectedSubjectData?.noteMaximale || 20})`}
                value={newGrade.gradeValue}
                onChange={(e) => {
                  const value = e.target.value
                  const noteMaximale = selectedSubjectData?.noteMaximale || 20
                  
                  setNewGrade({ ...newGrade, gradeValue: value })
                  
                  if (value && Number(value) > noteMaximale) {
                    setGradeError(`La note ne doit pas dépasser ${noteMaximale}`)
                  } else {
                    setGradeError("")
                  }
                }}
                className={gradeError ? "border-red-500" : ""}
              />
              {gradeError && (
                <p className="text-sm text-red-500 mt-1">{gradeError}</p>
              )}
            </div>

            <Button 
              className="w-full" 
              onClick={handleAddGrade}
              disabled={!newGrade.evaluationID || !newGrade.gradeValue || !!gradeError}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de commentaire */}
      <Dialog open={isCommentingGrade} onOpenChange={setIsCommentingGrade}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Commentaire</DialogTitle>
            <DialogDescription>
              Commentaire pour la note de {commentingGrade?.noteValue}/20
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commentText">Commentaire</Label>
              <Textarea
                id="commentText"
                placeholder="Commentaire sur la copie..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={async () => {
                try {
                  await updateGradeComment(commentingGrade.noteId, commentText)
                  setIsCommentingGrade(false)
                  setCommentingGrade(null)
                  setCommentText("")
                  await loadSubjectStudents()
                  toast.success('Commentaire ajouté avec succès!')
                } catch (error) {
                  toast.error('Erreur lors de l\'ajout du commentaire')
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer Commentaire
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions */}
      {!selectedSubject && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground space-y-2">
              <BookOpen className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-lg font-medium">Sélectionnez une matière pour commencer</p>
              <p>Choisissez la matière pour voir la liste des étudiants.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}