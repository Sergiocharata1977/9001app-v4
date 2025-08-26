export interface CreditRiskAnalysis {
  id: string
  clientName: string
  period: string
  analysisDate: string
  riskScore: number // 1-100
  riskCategory: "Baja" | "Media" | "Alta" | "Muy Alta"
  status: "Identificado" | "Evaluado" | "Mitigado" | "Monitoreado" | "Cerrado"

  // Indicadores financieros
  paymentCapacity: number
  profitMargin: number
  liquidity: number
  solvency: number
  debtRatio: number
  currentRatio: number
  returnOnAssets: number
  workingCapital: number

  observations: string
  recommendations: string
  createdAt: string
  updatedAt: string
}

export interface RiskStats {
  total: number
  low: number
  medium: number
  high: number
  veryHigh: number
  averageScore: number
}
