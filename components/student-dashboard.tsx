"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, TrendingUp, BookOpen, Award, Calendar } from "lucide-react"

const gradeData = [
  { subject: "Mathématiques", grade: 16.5, coefficient: 3, color: "bg-chart-1" },
  { subject: "Physique", grade: 14.2, coefficient: 2, color: "bg-chart-2" },
  { subject: "Chimie", grade: 15.8, coefficient: 2, color: "bg-chart-3" },
  { subject: "Français", grade: 13.5, coefficient: 2, color: "bg-chart-4" },
  { subject: "Anglais", grade: 17.2, coefficient: 1, color: "bg-chart-5" },
]

const progressData = [
  { month: "Sept", average: 12.5 },
  { month: "Oct", average: 13.2 },
  { month: "Nov", average: 14.1 },
  { month: "Déc", average: 15.3 },
  { month: "Jan", average: 15.8 },
]

export function StudentDashboard() {
  const overallAverage =
    gradeData.reduce((sum, item) => sum + item.grade * item.coefficient, 0) /
    gradeData.reduce((sum, item) => sum + item.coefficient, 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallAverage.toFixed(1)}/20</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.5 ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matières</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradeData.length}</div>
            <p className="text-xs text-muted-foreground">Évaluées ce semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rang</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/32</div>
            <p className="text-xs text-muted-foreground">Dans la classe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochain Examen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3j</div>
            <p className="text-xs text-muted-foreground">Mathématiques</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades by Subject */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notes par Matière</CardTitle>
              <CardDescription>Semestre en cours</CardDescription>
            </div>
            <Select defaultValue="current">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Semestre 1</SelectItem>
                <SelectItem value="previous">Semestre 2</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.subject}</span>
                    <Badge variant="outline" className="text-xs">
                      Coef. {item.coefficient}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{item.grade}</span>
                    <span className="text-muted-foreground">/20</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Résultats</CardTitle>
            <CardDescription>Moyenne mensuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[10, 20]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Téléchargez vos documents et consultez vos résultats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Relevé de Notes PDF</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <BookOpen className="w-4 h-4" />
              <span>Bulletins Précédents</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Calendar className="w-4 h-4" />
              <span>Planning des Examens</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
