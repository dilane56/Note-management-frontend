"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Search, BookOpen, Users, UserPlus, Loader2 } from "lucide-react"
import { useSubjects } from "@/hooks/useSubjects"

interface EditingSubject {
  id: number
  name: string
  coefficient: number
  noteMaximale: number
  classId: number
}

interface AssignTeacherData {
  subjectId: number
  subjectName: string
}

export function SubjectManagement() {
  const { subjects, classes, teachers, loading, createSubject, updateSubject, deleteSubject, assignTeacher } = useSubjects()
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [isAdding, setIsAdding] = useState(false)
  const [editing, setEditing] = useState<EditingSubject | null>(null)
  const [assigningTeacher, setAssigningTeacher] = useState<AssignTeacherData | null>(null)
  const [formData, setFormData] = useState({ name: "", coefficient: 1, noteMaximale: 20, classId: 0 })
  const [selectedTeacherId, setSelectedTeacherId] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesClass = classFilter === "all" || subject.className === classFilter
    return matchesSearch && matchesClass
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.classId) return

    setIsSubmitting(true)
    try {
      if (editing) {
        const success = await updateSubject(editing.id, formData)
        if (success) {
          setEditing(null)
          resetForm()
        }
      } else {
        const success = await createSubject(formData)
        if (success) {
          setIsAdding(false)
          resetForm()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (subject: any) => {
    const classe = classes.find(c => c.className === subject.className)
    setEditing({
      id: subject.id,
      name: subject.name,
      coefficient: subject.coefficient,
      noteMaximale: subject.noteMaximale,
      classId: classe?.id || 0
    })
    setFormData({
      name: subject.name,
      coefficient: subject.coefficient,
      noteMaximale: subject.noteMaximale,
      classId: classe?.id || 0
    })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      await deleteSubject(id)
    }
  }

  const handleAssignTeacher = async () => {
    if (!assigningTeacher || !selectedTeacherId) return

    setIsSubmitting(true)
    try {
      const result = await assignTeacher(selectedTeacherId, assigningTeacher.subjectId)
      if (result) {
        setAssigningTeacher(null)
        setSelectedTeacherId(0)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", coefficient: 1, noteMaximale: 20, classId: 0 })
    setEditing(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Matières</h2>
          <p className="text-muted-foreground">Configuration des matières et assignation des enseignants</p>
        </div>
        <Dialog open={isAdding || !!editing} onOpenChange={(open) => {
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Matière
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier la matière' : 'Créer une Matière'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Modifiez les informations de la matière' : 'Ajoutez une nouvelle matière au programme'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la matière</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Mathématiques, Physique..." 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coefficient">Coefficient</Label>
                  <Input 
                    id="coefficient" 
                    type="number" 
                    value={formData.coefficient}
                    onChange={(e) => setFormData(prev => ({ ...prev, coefficient: parseInt(e.target.value) }))}
                    min="1" 
                    max="10" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="noteMaximale">Note maximale</Label>
                  <Input 
                    id="noteMaximale" 
                    type="number" 
                    value={formData.noteMaximale}
                    onChange={(e) => setFormData(prev => ({ ...prev, noteMaximale: parseInt(e.target.value) }))}
                    min="10" 
                    max="100" 
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="class">Classe</Label>
                <Select 
                  value={formData.classId.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, classId: parseInt(value) }))}
                >
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  editing ? 'Modifier' : 'Créer la Matière'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une matière..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes.map((classe) => (
                  <SelectItem key={classe.id} value={classe.className}>
                    {classe.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Matières ({filteredSubjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Note Max</TableHead>
                <TableHead>Enseignants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="mt-2">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : filteredSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucune matière trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{subject.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{subject.className}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.coefficient}</Badge>
                    </TableCell>
                    <TableCell>{subject.noteMaximale}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 items-center">
                        {subject.teachers.map((teacher, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {teacher.teacherFirstName} {teacher.teacherLastName}
                          </Badge>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={() => setAssigningTeacher({ subjectId: subject.id, subjectName: subject.name })}
                        >
                          <UserPlus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(subject)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => handleDelete(subject.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Teacher Dialog */}
      <Dialog open={!!assigningTeacher} onOpenChange={(open) => {
        if (!open) {
          setAssigningTeacher(null)
          setSelectedTeacherId(0)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un Enseignant</DialogTitle>
            <DialogDescription>
              Assignez un enseignant à la matière "{assigningTeacher?.subjectName}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teacher">Enseignant</Label>
              <Select 
                value={selectedTeacherId.toString()} 
                onValueChange={(value) => setSelectedTeacherId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAssignTeacher} 
              className="w-full" 
              disabled={!selectedTeacherId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assignation...
                </>
              ) : (
                'Assigner l\'Enseignant'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}