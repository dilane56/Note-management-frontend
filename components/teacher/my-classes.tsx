"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { getTeacherClasses } from "@/lib/teacher-api"
import { ClassResponseDTO } from "@/lib/class-api"
import { Users, BookOpen, TrendingUp } from "lucide-react"

export function MyClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<ClassResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<ClassResponseDTO | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Chargement des classes pour l\'enseignant:', user.id)
        const data = await getTeacherClasses(user.id)
        console.log('Classes récupérées:', data)
        setClasses(data)
        setError(null)
      } catch (err: any) {
        console.error('Erreur lors du chargement des classes:', err)
        setError(`Erreur: ${err.message}`)
        setClasses([])
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchClasses()
    }
  }, [user])

  const handleViewDetails = (classe: ClassResponseDTO) => {
    setSelectedClass(classe)
    setIsModalOpen(true)
  }

  if (loading) {
    return <div>Chargement des classes...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mes Classes</h2>
        <p className="text-muted-foreground">Consultez les classes qui vous sont assignées</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Classes Assignées ({classes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.length > 0 ? (
              classes.map((classe) => (
                <Card key={classe.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{classe.className}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{classe.filiereName}</Badge>
                      <Badge variant="outline">{classe.students.length} étudiants</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>Filière: {classe.filiereName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{classe.students.length} étudiant{classe.students.length > 1 ? 's' : ''}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewDetails(classe)}
                      >
                        Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Aucune classe ne vous est assignée pour le moment.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal pour les détails de la classe */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedClass?.className} - Détails</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-6">
              {/* Informations de la classe */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations Générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom de la classe</p>
                      <p className="font-semibold">{selectedClass.className}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Filière</p>
                      <p className="font-semibold">{selectedClass.filiereName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre d'étudiants</p>
                      <p className="font-semibold">{selectedClass.students.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students List */}
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Étudiants ({selectedClass.students.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClass.students.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prénom</TableHead>
                          <TableHead>Matricule</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.students.map((student) => (
                          <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.studentLastName}</TableCell>
                            <TableCell>{student.studentFirstName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {student.studentMatricule || 'Non assigné'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun étudiant inscrit dans cette classe
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
