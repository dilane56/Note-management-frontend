"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import { useClasses } from "@/hooks/useClasses"

interface EditingClass {
  id: number
  className: string
  filiereId: number
}

export function ClassManagement() {
  const { classes, filieres, loading, createClass, updateClass, deleteClass } = useClasses()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [editing, setEditing] = useState<EditingClass | null>(null)
  const [formData, setFormData] = useState({ className: "", filiereId: 0 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredClasses = classes.filter((classe) =>
    classe.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.filiereName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.className.trim() || !formData.filiereId) return

    setIsSubmitting(true)
    try {
      if (editing) {
        const success = await updateClass(editing.id, formData)
        if (success) {
          setEditing(null)
          setFormData({ className: "", filiereId: 0 })
        }
      } else {
        const success = await createClass(formData)
        if (success) {
          setIsAdding(false)
          setFormData({ className: "", filiereId: 0 })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (classe: any) => {
    const filiere = filieres.find(f => f.name === classe.filiereName)
    setEditing({ 
      id: classe.id, 
      className: classe.className,
      filiereId: filiere?.id || 0
    })
    setFormData({ 
      className: classe.className,
      filiereId: filiere?.id || 0
    })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      await deleteClass(id)
    }
  }

  const resetForm = () => {
    setFormData({ className: "", filiereId: 0 })
    setEditing(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Classes</h2>
          <p className="text-muted-foreground">Gérez les classes de l'établissement</p>
        </div>
        <Dialog open={isAdding || !!editing} onOpenChange={(open) => {
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Classe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier la classe' : 'Créer une Classe'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Modifiez les informations de la classe' : 'Ajoutez une nouvelle classe'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="className">Nom de la classe</Label>
                <Input
                  id="className"
                  value={formData.className}
                  onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                  placeholder="Ex: Terminale S1, Première L2..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="filiere">Filière</Label>
                <Select 
                  value={formData.filiereId.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, filiereId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {filieres.map((filiere) => (
                      <SelectItem key={filiere.id} value={filiere.id.toString()}>
                        {filiere.name}
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
                  editing ? 'Modifier' : 'Créer'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une classe ou filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Classes ({filteredClasses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom de la classe</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="mt-2">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Aucune classe trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((classe) => (
                  <TableRow key={classe.id}>
                    <TableCell>{classe.id}</TableCell>
                    <TableCell className="font-medium">{classe.className}</TableCell>
                    <TableCell>{classe.filiereName}</TableCell>
                    <TableCell>{classe.students?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(classe)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(classe.id)}
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