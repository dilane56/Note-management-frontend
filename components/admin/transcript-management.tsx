"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useEvaluations } from "@/hooks/useEvaluations"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export function TranscriptManagement() {
  const { evaluations } = useEvaluations()
  const { token } = useAuth()
  const [filieres, setFilieres] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [filteredClasses, setFilteredClasses] = useState<any[]>([])
  const [selectedFiliere, setSelectedFiliere] = useState<string>("all")
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [filieresData, classesData] = await Promise.all([
          api.get('/api/filieres'),
          api.get('/api/classes')
        ])
        setFilieres(filieresData)
        setClasses(classesData)
        setFilteredClasses(classesData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedFiliere === "all") {
      setFilteredClasses(classes)
    } else {
      setFilteredClasses(classes.filter(classe => 
        classe.filiereId.toString() === selectedFiliere
      ))
    }
  }, [selectedFiliere, classes])

  const downloadTranscript = async (classId: number, className: string) => {
    if (!selectedEvaluation) {
      toast.error('Veuillez sélectionner une évaluation')
      return
    }

    setDownloading(classId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transcripts/class/${classId}/evaluations/${selectedEvaluation}/download-zip`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `releves-${className}-evaluation-${selectedEvaluation}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Relevés téléchargés avec succès')
      } else {
        toast.error('Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion des Relevés</h2>
        <p className="text-muted-foreground">Générez et téléchargez les relevés de notes par classe</p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Filière</label>
              <Select value={selectedFiliere} onValueChange={setSelectedFiliere}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les filières" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les filières</SelectItem>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere.id} value={filiere.id.toString()}>
                      {filiere.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Évaluation *</label>
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

      {/* Liste des classes */}
      <Card>
        <CardHeader>
          <CardTitle>Classes ({filteredClasses.length})</CardTitle>
          <CardDescription>
            Cliquez sur "Télécharger" pour générer les relevés de la classe sélectionnée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classe</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Étudiants</TableHead>
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
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Aucune classe trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((classe) => (
                  <TableRow key={classe.id}>
                    <TableCell className="font-medium">{classe.className}</TableCell>
                    <TableCell>{classe.filiereName}</TableCell>
                    <TableCell>{classe.students?.length || 0}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => downloadTranscript(classe.id, classe.className)}
                        disabled={!selectedEvaluation || downloading === classe.id}
                      >
                        {downloading === classe.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </>
                        )}
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