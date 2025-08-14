import { AMFERecord } from '../types/amfe';

// Datos mock iniciales
const mockData: AMFERecord[] = [
  {
    id: '1',
    year: 2024,
    process: 'Producción',
    function: 'Ensamblaje de componentes',
    failureMode: 'Componente mal ensamblado',
    effects: 'Producto defectuoso, retrabajo',
    causes: 'Falta de capacitación, herramientas inadecuadas',
    currentControls: 'Inspección visual, checklist',
    severity: 8,
    occurrence: 6,
    detection: 4,
    npr: 192,
    recommendedActions: 'Capacitación adicional, mejora de herramientas',
    responsible: 'Juan Pérez',
    dueDate: '2024-12-31',
    status: 'in-progress',
    riskLevel: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    year: 2024,
    process: 'Calidad',
    function: 'Inspección final',
    failureMode: 'Defectos no detectados',
    effects: 'Productos defectuosos llegan al cliente',
    causes: 'Procedimientos inadecuados, fatiga del inspector',
    currentControls: 'Muestreo estadístico',
    severity: 9,
    occurrence: 3,
    detection: 2,
    npr: 54,
    recommendedActions: 'Mejorar procedimientos, rotación de personal',
    responsible: 'María García',
    dueDate: '2024-11-30',
    status: 'pending',
    riskLevel: 'critical',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    year: 2024,
    process: 'Mantenimiento',
    function: 'Calibración de equipos',
    failureMode: 'Equipos descalibrados',
    effects: 'Mediciones inexactas, productos fuera de especificación',
    causes: 'Calendario de calibración no seguido, personal no capacitado',
    currentControls: 'Calendario de calibración, registros',
    severity: 7,
    occurrence: 4,
    detection: 5,
    npr: 140,
    recommendedActions: 'Sistema de alertas, capacitación específica',
    responsible: 'Carlos López',
    dueDate: '2024-10-15',
    status: 'completed',
    riskLevel: 'medium',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    year: 2024,
    process: 'Logística',
    function: 'Almacenamiento de materiales',
    failureMode: 'Materiales dañados por humedad',
    effects: 'Pérdida de materiales, retrasos en producción',
    causes: 'Control de humedad inadecuado, almacén sin climatización',
    currentControls: 'Monitoreo manual de humedad',
    severity: 6,
    occurrence: 5,
    detection: 6,
    npr: 180,
    recommendedActions: 'Sistema de control de humedad automático',
    responsible: 'Ana Rodríguez',
    dueDate: '2024-09-30',
    status: 'in-progress',
    riskLevel: 'high',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z'
  },
  {
    id: '5',
    year: 2024,
    process: 'Recursos Humanos',
    function: 'Capacitación del personal',
    failureMode: 'Personal no capacitado en nuevos procedimientos',
    effects: 'Errores en procesos, baja productividad',
    causes: 'Plan de capacitación no actualizado, falta de seguimiento',
    currentControls: 'Registro de capacitaciones',
    severity: 7,
    occurrence: 7,
    detection: 3,
    npr: 147,
    recommendedActions: 'Actualizar plan de capacitación, sistema de seguimiento',
    responsible: 'Luis Martínez',
    dueDate: '2024-12-15',
    status: 'pending',
    riskLevel: 'high',
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:20:00Z'
  },
  {
    id: '6',
    year: 2024,
    process: 'Compras',
    function: 'Evaluación de proveedores',
    failureMode: 'Proveedores no calificados',
    effects: 'Materiales de baja calidad, retrasos en entregas',
    causes: 'Criterios de evaluación inadecuados, falta de auditorías',
    currentControls: 'Lista de proveedores aprobados',
    severity: 8,
    occurrence: 3,
    detection: 4,
    npr: 96,
    recommendedActions: 'Mejorar criterios de evaluación, auditorías regulares',
    responsible: 'Patricia Sánchez',
    dueDate: '2024-11-15',
    status: 'in-progress',
    riskLevel: 'medium',
    createdAt: '2024-01-20T13:10:00Z',
    updatedAt: '2024-01-20T13:10:00Z'
  },
  {
    id: '7',
    year: 2024,
    process: 'Ventas',
    function: 'Gestión de pedidos',
    failureMode: 'Pedidos procesados incorrectamente',
    effects: 'Clientes insatisfechos, pérdida de ventas',
    causes: 'Sistema de pedidos confuso, falta de validación',
    currentControls: 'Revisión manual de pedidos',
    severity: 6,
    occurrence: 4,
    detection: 5,
    npr: 120,
    recommendedActions: 'Mejorar sistema de pedidos, validación automática',
    responsible: 'Roberto Díaz',
    dueDate: '2024-10-30',
    status: 'completed',
    riskLevel: 'medium',
    createdAt: '2024-01-21T10:30:00Z',
    updatedAt: '2024-01-21T10:30:00Z'
  },
  {
    id: '8',
    year: 2024,
    process: 'Finanzas',
    function: 'Control de costos',
    failureMode: 'Costos no controlados',
    effects: 'Pérdidas financieras, desviaciones presupuestarias',
    causes: 'Sistema de control inadecuado, falta de reportes',
    currentControls: 'Reportes mensuales',
    severity: 9,
    occurrence: 2,
    detection: 3,
    npr: 54,
    recommendedActions: 'Sistema de control en tiempo real, alertas automáticas',
    responsible: 'Carmen Ruiz',
    dueDate: '2024-12-31',
    status: 'pending',
    riskLevel: 'critical',
    createdAt: '2024-01-22T15:45:00Z',
    updatedAt: '2024-01-22T15:45:00Z'
  },
  {
    id: '9',
    year: 2024,
    process: 'Tecnología',
    function: 'Mantenimiento de sistemas',
    failureMode: 'Sistemas fuera de servicio',
    effects: 'Interrupción de operaciones, pérdida de datos',
    causes: 'Mantenimiento preventivo inadecuado, falta de respaldos',
    currentControls: 'Monitoreo básico de sistemas',
    severity: 10,
    occurrence: 2,
    detection: 2,
    npr: 40,
    recommendedActions: 'Mantenimiento preventivo programado, respaldos automáticos',
    responsible: 'Diego Morales',
    dueDate: '2024-11-30',
    status: 'in-progress',
    riskLevel: 'critical',
    createdAt: '2024-01-23T12:00:00Z',
    updatedAt: '2024-01-23T12:00:00Z'
  },
  {
    id: '10',
    year: 2024,
    process: 'Seguridad',
    function: 'Control de acceso',
    failureMode: 'Acceso no autorizado',
    effects: 'Pérdida de información confidencial, riesgos de seguridad',
    causes: 'Sistema de control inadecuado, falta de auditorías',
    currentControls: 'Tarjetas de acceso',
    severity: 10,
    occurrence: 1,
    detection: 4,
    npr: 40,
    recommendedActions: 'Sistema de control biométrico, auditorías regulares',
    responsible: 'Sofía Herrera',
    dueDate: '2024-12-15',
    status: 'pending',
    riskLevel: 'critical',
    createdAt: '2024-01-24T09:30:00Z',
    updatedAt: '2024-01-24T09:30:00Z'
  }
];

// Función para calcular NPR
const calculateNPR = (severity: number, occurrence: number, detection: number): number => {
  return severity * occurrence * detection;
};

// Función para determinar nivel de riesgo
const calculateRiskLevel = (npr: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (npr <= 50) return 'low';
  if (npr <= 100) return 'medium';
  if (npr <= 200) return 'high';
  return 'critical';
};

// Función para generar ID único
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

class AMFEService {
  private data: AMFERecord[] = [...mockData];

  // Obtener todos los registros
  async getAllRecords(): Promise<AMFERecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.data]), 500);
    });
  }

  // Obtener registro por ID
  async getRecordById(id: string): Promise<AMFERecord | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = this.data.find(r => r.id === id);
        resolve(record || null);
      }, 300);
    });
  }

  // Crear nuevo registro
  async createRecord(recordData: Omit<AMFERecord, 'id' | 'npr' | 'riskLevel' | 'createdAt' | 'updatedAt'>): Promise<AMFERecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const npr = calculateNPR(recordData.severity, recordData.occurrence, recordData.detection);
        const riskLevel = calculateRiskLevel(npr);
        const now = new Date().toISOString();
        
        const newRecord: AMFERecord = {
          ...recordData,
          id: generateId(),
          npr,
          riskLevel,
          createdAt: now,
          updatedAt: now
        };
        
        this.data.push(newRecord);
        resolve(newRecord);
      }, 500);
    });
  }

  // Actualizar registro
  async updateRecord(id: string, recordData: Partial<AMFERecord>): Promise<AMFERecord | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.data.findIndex(r => r.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        const updatedRecord = { ...this.data[index], ...recordData };
        
        // Recalcular NPR y riskLevel si se modificaron severity, occurrence o detection
        if (recordData.severity || recordData.occurrence || recordData.detection) {
          const severity = recordData.severity ?? this.data[index].severity;
          const occurrence = recordData.occurrence ?? this.data[index].occurrence;
          const detection = recordData.detection ?? this.data[index].detection;
          
          updatedRecord.npr = calculateNPR(severity, occurrence, detection);
          updatedRecord.riskLevel = calculateRiskLevel(updatedRecord.npr);
        }
        
        updatedRecord.updatedAt = new Date().toISOString();
        this.data[index] = updatedRecord;
        resolve(updatedRecord);
      }, 500);
    });
  }

  // Eliminar registro
  async deleteRecord(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.data.findIndex(r => r.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        
        this.data.splice(index, 1);
        resolve(true);
      }, 300);
    });
  }

  // Filtrar registros
  async filterRecords(filters: {
    process?: string;
    status?: string;
    riskLevel?: string;
    year?: number;
    search?: string;
  }): Promise<AMFERecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.data];
        
        if (filters.process) {
          filtered = filtered.filter(r => r.process.toLowerCase().includes(filters.process!.toLowerCase()));
        }
        
        if (filters.status) {
          filtered = filtered.filter(r => r.status === filters.status);
        }
        
        if (filters.riskLevel) {
          filtered = filtered.filter(r => r.riskLevel === filters.riskLevel);
        }
        
        if (filters.year) {
          filtered = filtered.filter(r => r.year === filters.year);
        }
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(r => 
            r.process.toLowerCase().includes(searchTerm) ||
            r.failureMode.toLowerCase().includes(searchTerm) ||
            r.causes.toLowerCase().includes(searchTerm)
          );
        }
        
        resolve(filtered);
      }, 300);
    });
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    byRiskLevel: Record<string, number>;
    byStatus: Record<string, number>;
    averageNPR: number;
    topRisks: AMFERecord[];
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = this.data.length;
        
        const byRiskLevel = this.data.reduce((acc, record) => {
          acc[record.riskLevel] = (acc[record.riskLevel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const byStatus = this.data.reduce((acc, record) => {
          acc[record.status] = (acc[record.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const averageNPR = this.data.reduce((sum, record) => sum + record.npr, 0) / total;
        
        const topRisks = [...this.data]
          .sort((a, b) => b.npr - a.npr)
          .slice(0, 5);
        
        resolve({
          total,
          byRiskLevel,
          byStatus,
          averageNPR: Math.round(averageNPR * 100) / 100,
          topRisks
        });
      }, 300);
    });
  }

  // Exportar a CSV
  async exportToCSV(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const headers = [
          'ID', 'Año', 'Proceso', 'Función', 'Modo de Fallo', 'Efectos', 'Causas',
          'Controles Actuales', 'Severidad', 'Ocurrencia', 'Detección', 'NPR',
          'Acciones Recomendadas', 'Responsable', 'Fecha Vencimiento', 'Estado', 'Nivel de Riesgo'
        ].join(',');
        
        const rows = this.data.map(record => [
          record.id, record.year, record.process, record.function, record.failureMode,
          record.effects, record.causes, record.currentControls, record.severity,
          record.occurrence, record.detection, record.npr, record.recommendedActions,
          record.responsible, record.dueDate, record.status, record.riskLevel
        ].join(','));
        
        const csv = [headers, ...rows].join('\n');
        resolve(csv);
      }, 500);
    });
  }
}

export const amfeService = new AMFEService();
