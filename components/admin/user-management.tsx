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
import { UserPlus, Edit, Trash2, Search } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@ecole.fr",
    role: "teacher",
    subject: "Mathématiques",
    status: "Actif",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Pierre Martin",
    email: "pierre.martin@ecole.fr",
    role: "student",
    class: "Terminale S1",
    status: "Actif",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Sophie Bernard",
    email: "sophie.bernard@ecole.fr",
    role: "teacher",
    subject: "Physique",
    status: "Inactif",
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    name: "Lucas Moreau",
    email: "lucas.moreau@ecole.fr",
    role: "student",
    class: "Première S2",
    status: "Actif",
    createdAt: "2024-01-25",
  },
  { id: 5, name: "Emma Petit", email: "emma.petit@ecole.fr", role: "admin", status: "Actif", createdAt: "2024-01-05" },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddingUser, setIsAddingUser] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "teacher":
        return "Enseignant"
      case "student":
        return "Étudiant"
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les comptes étudiants, enseignants et administrateurs</p>
        </div>
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Nouvel Utilisateur</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un Utilisateur</DialogTitle>
              <DialogDescription>Ajoutez un nouvel étudiant, enseignant ou administrateur</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Nom Prénom" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemple.com" />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Étudiant</SelectItem>
                    <SelectItem value="teacher">Enseignant</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setIsAddingUser(false)}>
                Créer le Compte
              </Button>
            </div>
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
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="student">Étudiants</SelectItem>
                <SelectItem value="teacher">Enseignants</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === "teacher" && user.subject}
                    {user.role === "student" && user.class}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Actif" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
