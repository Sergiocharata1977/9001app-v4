"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import type { CreditRiskAnalysis, RiskStats } from "@/types/credit-risk"

interface RiskReportsProps {
  analyses: CreditRiskAnalysis[]
  stats: RiskStats
}

export function RiskReports({ analyses, stats }: RiskReportsProps) {
  // Datos para gráficos
  const riskDistribution = [
    { name: "Riesgo Bajo", value: stats.low, color: "#10B981" },
    { name: "Riesgo Medio", value: stats.medium, color: "#F59E0B" },
    { name: "Riesgo Alto", value: stats.high, color: "#F97316" },
    { name: "Riesgo Muy Alto", value: stats.veryHigh, color: "#EF4444" },
  ]

  const monthlyTrend = [
    { month: "Ene", score: 72 },
    { month: "Feb", score: 68 },
    { month: "Mar", score: 71 },
    { month: "Abr", score: 69 },
    { month: "May", score: 73 },
    { month: "Jun", score: 70 },
    { month: "Jul", score: 68 },
    { month: "Ago", score: 72 },
    { month: "Sep", score: 69 },
    { month: "Oct", score: 71 },
    { month: "Nov", score: 68 },
    { month: "Dic", score: 69 },
  ]

  const indicatorComparison = [
    { indicator: "Cap. Pago", promedio: 75, sector: 68 },
    { indicator: "Liquidez", promedio: 1.8, sector: 1.5 },
    { indicator: "Solvencia", promedio: 0.58, sector: 0.52 },
    { indicator: "ROA", promedio: 8.5, sector: 7.2 },
  ]

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Evaluados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.2% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riesgo Promedio</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <Progress value={stats.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.veryHigh}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.veryHigh / stats.total) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Seguros</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
            <p className="text-xs text-muted-foreground">{((stats.low / stats.total) * 100).toFixed(1)}% del total</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Riesgo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría de Riesgo</CardTitle>
            <CardDescription>Porcentaje de clientes por nivel de riesgo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendencia Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Riesgo Promedio</CardTitle>
            <CardDescription>Evolución del puntaje promedio por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 80]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comparación de Indicadores */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación con Sector Agropecuario</CardTitle>
          <CardDescription>Indicadores clave vs promedio del sector</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={indicatorComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="indicator" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" fill="#10B981" name="Nuestros Clientes" />
              <Bar dataKey="sector" fill="#6B7280" name="Promedio Sector" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Clientes por Riesgo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Clientes de Menor Riesgo</CardTitle>
            <CardDescription>Top 5 clientes con mejor puntuación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyses
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 5)
                .map((client, index) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{client.clientName}</p>
                        <p className="text-sm text-muted-foreground">{client.period}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">{client.riskScore}/100</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Clientes de Mayor Riesgo</CardTitle>
            <CardDescription>Top 5 clientes que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyses
                .sort((a, b) => a.riskScore - b.riskScore)
                .slice(0, 5)
                .map((client, index) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{client.clientName}</p>
                        <p className="text-sm text-muted-foreground">{client.period}</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">{client.riskScore}/100</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
