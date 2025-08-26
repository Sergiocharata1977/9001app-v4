"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Target, Shield, Monitor, Lock, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CreditRiskAnalysis } from "@/types/credit-risk"

interface RiskKanbanProps {
  analyses: CreditRiskAnalysis[]
}

const columns = [
  {
    id: "Identificado",
    title: "Identificado",
    color: "bg-red-100 border-red-200",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  {
    id: "Evaluado",
    title: "Evaluado",
    color: "bg-orange-100 border-orange-200",
    icon: Target,
    iconColor: "text-orange-500",
  },
  {
    id: "Mitigado",
    title: "Mitigado",
    color: "bg-yellow-100 border-yellow-200",
    icon: Shield,
    iconColor: "text-yellow-600",
  },
  {
    id: "Monitoreado",
    title: "Monitoreado",
    color: "bg-blue-100 border-blue-200",
    icon: Monitor,
    iconColor: "text-blue-500",
  },
  { id: "Cerrado", title: "Cerrado", color: "bg-green-100 border-green-200", icon: Lock, iconColor: "text-green-500" },
]

export function RiskKanban({ analyses }: RiskKanbanProps) {
  const [items, setItems] = useState(analyses)

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    if (score >= 40) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {columns.map((column) => {
        const columnItems = items.filter((item) => item.status === column.id)
        const Icon = column.icon

        return (
          <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-[600px]`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon className={`h-5 w-5 ${column.iconColor}`} />
                <h3 className="font-semibold text-gray-800">{column.title}</h3>
              </div>
              <Badge variant="secondary" className="bg-white/80">
                {columnItems.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {columnItems.map((item) => (
                <Card key={item.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-gray-900 mb-1">{item.clientName}</CardTitle>
                        <p className="text-xs text-gray-500">{item.period}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Mover a...</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Risk Score */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Puntuación</span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(item.riskScore)}`}>
                          {item.riskScore}/100
                        </div>
                      </div>

                      {/* Risk Category */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Categoría</span>
                        <Badge className={`${getRiskColor(item.riskCategory)} text-white text-xs`}>
                          {item.riskCategory}
                        </Badge>
                      </div>

                      {/* Key Indicators */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Cap. Pago</span>
                          <p className="font-medium">{item.paymentCapacity}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Liquidez</span>
                          <p className="font-medium">{item.liquidity}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Análisis: {new Date(item.analysisDate).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
