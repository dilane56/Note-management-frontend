"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import { useFilieres } from "@/hooks/useFilieres"

interface EditingFiliere {
  id: number
  name: string
}

export function FiliereManagement() {
  const { filieres, loading, createFiliere, updateFiliere, deleteFiliere } = useFilieres()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [editing, setEditing] = useState<EditingFiliere | null>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredFilieres = filieres.filter((filiere) =>
    filiere.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      if (editing) {
        const success = await updateFiliere(editing.id, formData)
        if (success) {
          setEditing(null)
          setFormData({ name: "" })
        }
      } else {
        const success = await createFiliere(formData)
        if (success) {
          setIsAdding(false)
          setFormData({ name: "" })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (filiere: any) => {
    setEditing({ id: filiere.id, name: filiere.name })
    setFormData({ name: filiere.name })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      await deleteFiliere(id)
    }
  }

  const resetForm = () => {
    setFormData({ name: "" })
    setEditing(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Filières</h2>
          <p className="text-muted-foreground">Gérez les filières de l'établissement</p>
        </div>
        <Dialog open={isAdding || !!editing} onOpenChange={(open) => {
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Filière
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier la filière' : 'Créer une Filière'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Modifiez les informations de la filière' : 'Ajoutez une nouvelle filière'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la filière</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Ex: Scientifique, Littéraire..."
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filieres Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Filières ({filteredFilieres.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="mt-2">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : filteredFilieres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Aucune filière trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredFilieres.map((filiere) => (
                  <TableRow key={filiere.id}>
                    <TableCell>{filiere.id}</TableCell>
                    <TableCell className="font-medium">{filiere.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(filiere)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(filiere.id)}
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