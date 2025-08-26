"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Calculator } from "lucide-react"
import type { CreditRiskAnalysis } from "@/types/credit-risk"

interface RiskAnalysisFormProps {
  onClose: () => void
  analysis?: CreditRiskAnalysis
}

export function RiskAnalysisForm({ onClose, analysis }: RiskAnalysisFormProps) {
  const [formData, setFormData] = useState({
    clientName: analysis?.clientName || "",
    period: analysis?.period || "",
    analysisDate: analysis?.analysisDate || new Date().toISOString().split("T")[0],
    paymentCapacity: analysis?.paymentCapacity || 0,
    profitMargin: analysis?.profitMargin || 0,
    liquidity: analysis?.liquidity || 0,
    solvency: analysis?.solvency || 0,
    debtRatio: analysis?.debtRatio || 0,
    currentRatio: analysis?.currentRatio || 0,
    returnOnAssets: analysis?.returnOnAssets || 0,
    workingCapital: analysis?.workingCapital || 0,
    observations: analysis?.observations || "",
    recommendations: analysis?.recommendations || "",
  })

  const calculateRiskScore = () => {
    // Algoritmo simplificado de cálculo de riesgo
    const weights = {
      paymentCapacity: 0.25,
      profitMargin: 0.15,
      liquidity: 0.15,
      solvency: 0.15,
      debtRatio: 0.1,
      currentRatio: 0.1,
      returnOnAssets: 0.1,
    }

    let score = 0
    score += formData.paymentCapacity * weights.paymentCapacity
    score += (formData.profitMargin / 20) * 100 * weights.profitMargin
    score += Math.min(formData.liquidity / 2, 1) * 100 * weights.liquidity
    score += (1 - formData.solvency) * 100 * weights.solvency
    score += (1 - formData.debtRatio) * 100 * weights.debtRatio
    score += Math.min(formData.currentRatio / 2, 1) * 100 * weights.currentRatio
    score += (formData.returnOnAssets / 15) * 100 * weights.returnOnAssets

    return Math.round(Math.max(0, Math.min(100, score)))
  }

  const getRiskCategory = (score: number) => {
    if (score >= 80) return "Baja"
    if (score >= 60) return "Media"
    if (score >= 40) return "Alta"
    return "Muy Alta"
  }

  const riskScore = calculateRiskScore()
  const riskCategory = getRiskCategory(riskScore)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el análisis
    console.log("Guardando análisis:", { ...formData, riskScore, riskCategory })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">
              {analysis ? "Editar Análisis de Riesgo" : "Nuevo Análisis de Riesgo"}
            </h2>
            <p className="text-muted-foreground">
              Complete la información financiera para evaluar el riesgo crediticio
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Datos generales del cliente y período de análisis</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="clientName">Nombre del Cliente</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Ej: Agropecuaria San Juan"
                  required
                />
              </div>
              <div>
                <Label htmlFor="period">Período</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-Q1">2024 - Q1</SelectItem>
                    <SelectItem value="2024-Q2">2024 - Q2</SelectItem>
                    <SelectItem value="2024-Q3">2024 - Q3</SelectItem>
                    <SelectItem value="2024-Q4">2024 - Q4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="analysisDate">Fecha de Análisis</Label>
                <Input
                  id="analysisDate"
                  type="date"
                  value={formData.analysisDate}
                  onChange={(e) => setFormData({ ...formData, analysisDate: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Indicadores Financieros */}
          <Card>
            <CardHeader>
              <CardTitle>Indicadores Financieros</CardTitle>
              <CardDescription>Métricas clave para la evaluación de riesgo</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="paymentCapacity">Capacidad de Pago (%)</Label>
                <Input
                  id="paymentCapacity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.paymentCapacity}
                  onChange={(e) => setFormData({ ...formData, paymentCapacity: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="profitMargin">Margen de Utilidad (%)</Label>
                <Input
                  id="profitMargin"
                  type="number"
                  step="0.1"
                  value={formData.profitMargin}
                  onChange={(e) => setFormData({ ...formData, profitMargin: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="liquidity">Liquidez</Label>
                <Input
                  id="liquidity"
                  type="number"
                  step="0.1"
                  value={formData.liquidity}
                  onChange={(e) => setFormData({ ...formData, liquidity: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="solvency">Solvencia</Label>
                <Input
                  id="solvency"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.solvency}
                  onChange={(e) => setFormData({ ...formData, solvency: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="debtRatio">Ratio de Endeudamiento</Label>
                <Input
                  id="debtRatio"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.debtRatio}
                  onChange={(e) => setFormData({ ...formData, debtRatio: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="currentRatio">Ratio Corriente</Label>
                <Input
                  id="currentRatio"
                  type="number"
                  step="0.1"
                  value={formData.currentRatio}
                  onChange={(e) => setFormData({ ...formData, currentRatio: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="returnOnAssets">ROA (%)</Label>
                <Input
                  id="returnOnAssets"
                  type="number"
                  step="0.1"
                  value={formData.returnOnAssets}
                  onChange={(e) => setFormData({ ...formData, returnOnAssets: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="workingCapital">Capital de Trabajo</Label>
                <Input
                  id="workingCapital"
                  type="number"
                  value={formData.workingCapital}
                  onChange={(e) => setFormData({ ...formData, workingCapital: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Evaluación de Riesgo Calculada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Evaluación de Riesgo Calculada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold mb-2">{riskScore}/100</div>
                  <div className="text-sm text-muted-foreground">Puntuación de Riesgo</div>
                </div>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      riskCategory === "Baja"
                        ? "text-green-600"
                        : riskCategory === "Media"
                          ? "text-yellow-600"
                          : riskCategory === "Alta"
                            ? "text-orange-600"
                            : "text-red-600"
                    }`}
                  >
                    {riskCategory}
                  </div>
                  <div className="text-sm text-muted-foreground">Categoría de Riesgo</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones y Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones y Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observations">Observaciones</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Describa las observaciones relevantes del análisis..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="recommendations">Recomendaciones</Label>
                <Textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Indique las recomendaciones para el cliente..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Guardar Análisis
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
