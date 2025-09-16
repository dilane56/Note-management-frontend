"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Loader2, BookOpen, Eye } from "lucide-react"
import { useTeacherSubjects } from "@/hooks/useTeacherSubjects"

export function MySubjects() {
  const { subjects, loading, updateCoefficient } = useTeacherSubjects()
  const [editingSubject, setEditingSubject] = useState<{ id: number; coefficient: number } | null>(null)
  const [newCoefficient, setNewCoefficient] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const displaySubjects = subjects

  // Utilisation des vraies données de la matière sélectionnée
  const subjectEvaluations = selectedSubject?.evaluations || []
  const subjectRecentGrades = selectedSubject?.recentGrades || []

  const handleEdit = (subject: any) => {
    setEditingSubject({ id: subject.id, coefficient: subject.coefficient })
    setNewCoefficient(subject.coefficient.toString())
  }

  const handleViewDetails = (subject: any) => {
    setSelectedSubject(subject)
    setIsDetailsModalOpen(true)
  }

  const overallAverage = (subjectEvaluations && subjectEvaluations.length > 0)
    ? subjectEvaluations.reduce((sum: number, evaluation: any) => sum + (evaluation.average ?? 0), 0) / subjectEvaluations.length
    : 0

  const handleSave = async () => {
    if (!editingSubject) return
    
    const coefficient = parseFloat(newCoefficient)
    if (isNaN(coefficient) || coefficient <= 0) {
      return
    }

    const success = await updateCoefficient(editingSubject.id, coefficient)
    if (success) {
      setEditingSubject(null)
      setNewCoefficient("")
    }
  }



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mes Matières</h2>
        <p className="text-muted-foreground">Consultez et gérez vos matières assignées</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Matières Assignées ({displaySubjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="mt-2">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : displaySubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucune matière assignée
                  </TableCell>
                </TableRow>
              ) : (
                displaySubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.className}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">{subject.coefficient}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(subject)}
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Dialog open={editingSubject?.id === subject.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingSubject(null)
                            setNewCoefficient("")
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(subject)} title="Modifier le coefficient">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le Coefficient</DialogTitle>
                              <DialogDescription>
                                Matière: {subject.name} - Classe: {subject.className}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="coefficient">Nouveau Coefficient</Label>
                                <Input
                                  id="coefficient"
                                  type="number"
                                  min="0.1"
                                  step="0.1"
                                  value={newCoefficient}
                                  onChange={(e) => setNewCoefficient(e.target.value)}
                                  placeholder="Ex: 2.5"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleSave} className="flex-1">
                                  Enregistrer
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setEditingSubject(null)
                                    setNewCoefficient("")
                                  }}
                                  className="flex-1"
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal pour les détails de la matière */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSubject?.name} - {selectedSubject?.className}
            </DialogTitle>
          </DialogHeader>
          {selectedSubject && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de la Matière</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom de la matière</p>
                        <p className="font-semibold text-lg">{selectedSubject.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Classe</p>
                        <p className="font-semibold">{selectedSubject.className || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coefficient</p>
                        <p className="font-semibold text-primary">{selectedSubject.coefficient}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Note maximale</p>
                        <p className="font-semibold">{selectedSubject.noteMaximale || 20}/20</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}