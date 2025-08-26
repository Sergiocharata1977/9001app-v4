"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Target, Shield, Monitor, Lock, Plus, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { RiskKanban } from "./risk-kanban"
import { RiskAnalysisForm } from "./risk-analysis-form"
import { RiskReports } from "./risk-reports"
import type { CreditRiskAnalysis, RiskStats } from "@/types/credit-risk"

// Mock data para demostración
const mockAnalyses: CreditRiskAnalysis[] = [
  {
    id: "1",
    clientName: "Agropecuaria San Juan",
    period: "2024-Q4",
    analysisDate: "2024-12-15",
    riskScore: 85,
    riskCategory: "Baja",
    status: "Monitoreado",
    paymentCapacity: 92,
    profitMargin: 18.5,
    liquidity: 2.3,
    solvency: 0.65,
    debtRatio: 0.35,
    currentRatio: 2.1,
    returnOnAssets: 12.8,
    workingCapital: 450000,
    observations: "Cliente con historial sólido y buena capacidad de pago.",
    recommendations: "Mantener seguimiento trimestral.",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "2",
    clientName: "Granja Los Álamos",
    period: "2024-Q4",
    analysisDate: "2024-12-10",
    riskScore: 45,
    riskCategory: "Alta",
    status: "Evaluado",
    paymentCapacity: 58,
    profitMargin: 8.2,
    liquidity: 1.1,
    solvency: 0.45,
    debtRatio: 0.55,
    currentRatio: 1.2,
    returnOnAssets: 5.1,
    workingCapital: 125000,
    observations: "Problemas de liquidez detectados en el último trimestre.",
    recommendations: "Implementar plan de mejora financiera y seguimiento mensual.",
    createdAt: "2024-12-05",
    updatedAt: "2024-12-10",
  },
  {
    id: "3",
    clientName: "Cooperativa El Campo",
    period: "2024-Q4",
    analysisDate: "2024-12-08",
    riskScore: 25,
    riskCategory: "Muy Alta",
    status: "Identificado",
    paymentCapacity: 32,
    profitMargin: 3.1,
    liquidity: 0.8,
    solvency: 0.25,
    debtRatio: 0.75,
    currentRatio: 0.9,
    returnOnAssets: 1.8,
    workingCapital: -50000,
    observations: "Situación financiera crítica con capital de trabajo negativo.",
    recommendations: "Requiere intervención inmediata y reestructuración de deuda.",
    createdAt: "2024-12-08",
    updatedAt: "2024-12-08",
  },
]

const mockStats: RiskStats = {
  total: 156,
  low: 89,
  medium: 42,
  high: 18,
  veryHigh: 7,
  averageScore: 68.5,
}

export function CreditRiskDashboard() {
  const [analyses] = useState<CreditRiskAnalysis[]>(mockAnalyses)
  const [stats] = useState<RiskStats>(mockStats)
  const [showForm, setShowForm] = useState(false)

  const getRiskColor = (category: string) => {
    switch (category) {
      case "Baja":
        return "bg-green-500"
      case "Media":
        return "bg-yellow-500"
      case "Alta":
        return "bg-orange-500"
      case "Muy Alta":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Identificado":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "Evaluado":
        return <Target className="h-4 w-4 text-orange-500" />
      case "Mitigado":
        return <Shield className="h-4 w-4 text-yellow-500" />
      case "Monitoreado":
        return <Monitor className="h-4 w-4 text-blue-500" />
      case "Cerrado":
        return <Lock className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM Análisis de Riesgo de Crédito</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Sistema especializado para empresas agropecuarias - ISO 9001
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Análisis
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Análisis</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riesgo Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <p className="text-xs text-muted-foreground">Puntuación sobre 100</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.veryHigh + stats.high}</div>
              <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distribución de Riesgo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-1">
                <div
                  className="flex-1 bg-green-500 h-2 rounded"
                  style={{ width: `${(stats.low / stats.total) * 100}%` }}
                ></div>
                <div
                  className="flex-1 bg-yellow-500 h-2 rounded"
                  style={{ width: `${(stats.medium / stats.total) * 100}%` }}
                ></div>
                <div
                  className="flex-1 bg-orange-500 h-2 rounded"
                  style={{ width: `${(stats.high / stats.total) * 100}%` }}
                ></div>
                <div
                  className="flex-1 bg-red-500 h-2 rounded"
                  style={{ width: `${(stats.veryHigh / stats.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Bajo</span>
                <span>Alto</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card className="mb-8 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Alertas de Riesgo Alto
            </CardTitle>
            <CardDescription>Clientes que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyses
                .filter((a) => a.riskCategory === "Alta" || a.riskCategory === "Muy Alta")
                .map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(analysis.status)}
                      <div>
                        <p className="font-medium">{analysis.clientName}</p>
                        <p className="text-sm text-muted-foreground">{analysis.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getRiskColor(analysis.riskCategory)} text-white`}>
                        {analysis.riskCategory}
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold">{analysis.riskScore}/100</p>
                        <p className="text-sm text-muted-foreground">Puntuación</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="kanban" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Vista Kanban</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <RiskKanban analyses={analyses} />
          </TabsContent>

          <TabsContent value="reports">
            <RiskReports analyses={analyses} stats={stats} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Módulo de analíticas avanzadas en desarrollo</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Modal */}
      {showForm && <RiskAnalysisForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
