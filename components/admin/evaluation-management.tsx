"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit, Trash2, Search, Loader2, CheckSquare } from "lucide-react"
import { useEvaluations } from "@/hooks/useEvaluations"

interface EditingEvaluation {
  id: number
  type: string
  anneeAcademique: string
}

const evaluationTypes = [
  { value: 'SEQUENCE1', label: 'Séquence 1' },
  { value: 'SEQUENCE2', label: 'Séquence 2' },
  { value: 'SEQUENCE3', label: 'Séquence 3' },
  { value: 'TRIMESTRE1', label: 'Trimestre 1' },
  { value: 'TRIMESTRE2', label: 'Trimestre 2' },
  { value: 'TRIMESTRE3', label: 'Trimestre 3' },
  { value: 'SEMESTRE1', label: 'Semestre 1' },
  { value: 'SEMESTRE2', label: 'Semestre 2' },
  { value: 'ANNUAL', label: 'Annuel' }
]

export function EvaluationManagement() {
  const { evaluations, loading, createEvaluation, updateEvaluation, deleteEvaluation } = useEvaluations()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAdding, setIsAdding] = useState(false)
  const [editing, setEditing] = useState<EditingEvaluation | null>(null)
  const [formData, setFormData] = useState({ type: "", anneeAcademique: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const typeLabel = evaluationTypes.find(t => t.value === evaluation.typeEvaluation)?.label || evaluation.typeEvaluation || ''
    const matchesSearch = 
      typeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evaluation.anneeAcademique || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || evaluation.typeEvaluation === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeLabel = (type: string) => {
    return evaluationTypes.find(t => t.value === type)?.label || type
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.anneeAcademique.trim()) return

    setIsSubmitting(true)
    try {
      if (editing) {
        const success = await updateEvaluation(editing.id, formData as any)
        if (success) {
          setEditing(null)
          resetForm()
        }
      } else {
        const success = await createEvaluation(formData as any)
        if (success) {
          setIsAdding(false)
          resetForm()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (evaluation: any) => {
    setEditing({
      id: evaluation.id,
      type: evaluation.type,
      anneeAcademique: evaluation.anneeAcademique
    })
    setFormData({
      type: evaluation.type,
      anneeAcademique: evaluation.anneeAcademique
    })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      await deleteEvaluation(id)
    }
  }

  const resetForm = () => {
    setFormData({ type: "", anneeAcademique: "" })
    setEditing(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Évaluations</h2>
          <p className="text-muted-foreground">Gérez les périodes d'évaluation de l'établissement</p>
        </div>
        <Dialog open={isAdding || !!editing} onOpenChange={(open) => {
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Évaluation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier l\'évaluation' : 'Créer une Évaluation'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Modifiez les informations de l\'évaluation' : 'Ajoutez une nouvelle période d\'évaluation'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Type d'évaluation</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="anneeAcademique">Année académique</Label>
                <Input
                  id="anneeAcademique"
                  value={formData.anneeAcademique}
                  onChange={(e) => setFormData(prev => ({ ...prev, anneeAcademique: e.target.value }))}
                  placeholder="Ex: 2023-2024"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  editing ? 'Modifier' : 'Créer'
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
                  placeholder="Rechercher une évaluation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {evaluationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Évaluations ({filteredEvaluations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Année académique</TableHead>
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
              ) : filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucune évaluation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="outline">{getTypeLabel(evaluation.typeEvaluation)}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{evaluation.anneeAcademique}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(evaluation)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(evaluation.id)}
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
    </div>
  )
}