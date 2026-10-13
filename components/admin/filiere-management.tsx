"use client"

import type React from "react"
import { useState } from "react"
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"
import { ConfirmDialog, ErrorState, SectionHeader, TableStateRow, useConfirmDelete } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFilieres } from "@/hooks/useFilieres"
import { normalize } from "@/lib/format"
import type { Filiere } from "@/lib/types"

export function FiliereManagement() {
  const { filieres, loading, error, reload, createFiliere, updateFiliere, deleteFiliere } = useFilieres()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Filiere | null>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmDelete = useConfirmDelete<Filiere>()

  const filteredFilieres = filieres.filter((filiere) => normalize(filiere.name).includes(normalize(searchTerm)))

  const openCreate = () => {
    setEditing(null)
    setName("")
    setDialogOpen(true)
  }

  const openEdit = (filiere: Filiere) => {
    setEditing(filiere)
    setName(filiere.name)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)
    const ok = editing ? await updateFiliere(editing.id, name.trim()) : await createFiliere(name.trim())
    setIsSubmitting(false)
    if (ok) setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion des filières"
        description="Gérez les filières de l'établissement"
        actions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle filière
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={(open) => !isSubmitting && setDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la filière" : "Créer une filière"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifiez le nom de la filière" : "Ajoutez une nouvelle filière"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filiere-name">Nom de la filière</Label>
              <Input
                id="filiere-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Scientifique, Littéraire..."
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || !name.trim()}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        {...confirmDelete.dialogProps}
        title="Supprimer la filière"
        description={`Supprimer la filière « ${confirmDelete.target?.name ?? ""} » ? Une filière qui contient encore des classes ne peut pas être supprimée.`}
        onConfirm={() => confirmDelete.target && deleteFiliere(confirmDelete.target.id)}
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
            <Input
              placeholder="Rechercher une filière..."
              aria-label="Rechercher une filière"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des filières ({filteredFilieres.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || filteredFilieres.length === 0 ? (
                <TableStateRow colSpan={2} loading={loading} emptyLabel="Aucune filière trouvée" />
              ) : (
                filteredFilieres.map((filiere) => (
                  <TableRow key={filiere.id}>
                    <TableCell className="font-medium">{filiere.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(filiere)} aria-label={`Modifier ${filiere.name}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirmDelete.ask(filiere)}
                        aria-label={`Supprimer ${filiere.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
