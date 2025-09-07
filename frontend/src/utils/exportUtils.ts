import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (value: any) => string;
}

export interface ExportOptions {
  filename: string;
  sheetName?: string;
  columns?: ExportColumn[];
  includeHeaders?: boolean;
}

/**
 * Exporta datos a CSV
 */
export const exportToCSV = (data: any[], options: ExportOptions): void => {
  const { filename, columns, includeHeaders = true } = options;
  
  let csvContent = '';
  
  // Agregar encabezados si se especifica
  if (includeHeaders && columns) {
    const headers = columns.map(col => `"${col.label}"`).join(',');
    csvContent += headers + '\n';
  }
  
  // Agregar datos
  data.forEach(row => {
    const values = columns 
      ? columns.map(col => {
          const value = row[col.key];
          const formattedValue = col.formatter ? col.formatter(value) : value;
          return `"${formattedValue || ''}"`;
        })
      : Object.values(row).map(value => `"${value || ''}"`);
    
    csvContent += values.join(',') + '\n';
  });
  
  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

/**
 * Exporta datos a Excel
 */
export const exportToExcel = (data: any[], options: ExportOptions): void => {
  const { filename, sheetName = 'Datos', columns, includeHeaders = true } = options;
  
  // Preparar datos para Excel
  let excelData: any[] = [];
  
  if (includeHeaders && columns) {
    // Agregar encabezados
    const headers = columns.map(col => col.label);
    excelData.push(headers);
    
    // Agregar datos con formateo
    data.forEach(row => {
      const values = columns.map(col => {
        const value = row[col.key];
        return col.formatter ? col.formatter(value) : value;
      });
      excelData.push(values);
    });
  } else {
    // Usar datos tal como están
    excelData = data;
  }
  
  // Crear libro de trabajo
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Configurar ancho de columnas
  if (columns) {
    const colWidths = columns.map(col => ({
      wch: Math.max(col.label.length, 15)
    }));
    ws['!cols'] = colWidths;
  }
  
  // Agregar hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generar y descargar archivo
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
};

/**
 * Exporta datos a JSON
 */
export const exportToJSON = (data: any[], options: ExportOptions): void => {
  const { filename } = options;
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
};

/**
 * Formateadores comunes
 */
export const formatters = {
  date: (value: any) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('es-ES');
  },
  
  datetime: (value: any) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('es-ES');
  },
  
  currency: (value: any) => {
    if (!value) return '0.00';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  },
  
  number: (value: any) => {
    if (!value) return '0';
    return new Intl.NumberFormat('es-ES').format(value);
  },
  
  percentage: (value: any) => {
    if (!value) return '0%';
    return `${value}%`;
  },
  
  boolean: (value: any) => {
    return value ? 'Sí' : 'No';
  },
  
  status: (value: any) => {
    const statusMap: Record<string, string> = {
      'activo': 'Activo',
      'inactivo': 'Inactivo',
      'pendiente': 'Pendiente',
      'completado': 'Completado',
      'cancelado': 'Cancelado',
      'en_progreso': 'En Progreso'
    };
    return statusMap[value] || value;
  },
  
  nivel_critico: (value: any) => {
    const nivelMap: Record<string, string> = {
      'bajo': 'Bajo',
      'medio': 'Medio',
      'alto': 'Alto',
      'critico': 'Crítico'
    };
    return nivelMap[value] || value;
  },
  
  tipo_proceso: (value: any) => {
    const tipoMap: Record<string, string> = {
      'estrategico': 'Estratégico',
      'operativo': 'Operativo',
      'apoyo': 'Apoyo',
      'mejora': 'Mejora'
    };
    return tipoMap[value] || value;
  }
};

/**
 * Columnas predefinidas para diferentes entidades
 */
export const exportColumns = {
  personal: [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fecha_ingreso', label: 'Fecha de Ingreso', formatter: formatters.date },
    { key: 'tipo_personal', label: 'Tipo de Personal' },
    { key: 'estado', label: 'Estado', formatter: formatters.status },
    { key: 'created_at', label: 'Fecha de Creación', formatter: formatters.datetime }
  ],
  
  procesos: [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'tipo', label: 'Tipo', formatter: formatters.tipo_proceso },
    { key: 'categoria', label: 'Categoría' },
    { key: 'nivel_critico', label: 'Nivel Crítico', formatter: formatters.nivel_critico },
    { key: 'estado', label: 'Estado', formatter: formatters.status },
    { key: 'fecha_vigencia', label: 'Fecha de Vigencia', formatter: formatters.date },
    { key: 'fecha_revision', label: 'Fecha de Revisión', formatter: formatters.date }
  ],
  
  indicadores: [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'meta', label: 'Meta', formatter: formatters.number },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'estado', label: 'Estado', formatter: formatters.status },
    { key: 'created_at', label: 'Fecha de Creación', formatter: formatters.datetime }
  ],
  
  objetivos: [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre_objetivo', label: 'Nombre del Objetivo' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'meta', label: 'Meta' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'fecha_inicio', label: 'Fecha de Inicio', formatter: formatters.date },
    { key: 'fecha_limite', label: 'Fecha Límite', formatter: formatters.date },
    { key: 'estado', label: 'Estado', formatter: formatters.status },
    { key: 'prioridad', label: 'Prioridad' },
    { key: 'tipo', label: 'Tipo' }
  ],
  
  mediciones: [
    { key: 'indicador_nombre', label: 'Indicador' },
    { key: 'valor', label: 'Valor', formatter: formatters.number },
    { key: 'fecha_medicion', label: 'Fecha de Medición', formatter: formatters.date },
    { key: 'responsable_nombre', label: 'Responsable' },
    { key: 'estado', label: 'Estado', formatter: formatters.status },
    { key: 'confiabilidad', label: 'Confiabilidad' },
    { key: 'metodo_medicion', label: 'Método de Medición' },
    { key: 'observaciones', label: 'Observaciones' }
  ]
};
