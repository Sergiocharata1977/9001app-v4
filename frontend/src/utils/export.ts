import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import type { ExportColumn, ExportData } from '../types';

// Configuración para exportar PDF
interface PDFTableConfig {
  startY: number;
  head: string[][];
  body: (string | number | null | undefined)[][];
  theme: 'striped' | 'grid' | 'plain';
  styles: {
    fontSize: number;
    cellPadding: number;
    overflow: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
    cellWidth: 'auto' | 'wrap' | number;
  };
  columnStyles: {
    [key: number]: {
      cellWidth: number | 'auto';
    };
  };
  margin: {
    top: number;
  };
}

// Tipo para formato de exportación
type ExportFormat = 'pdf' | 'excel';

export const exportToPDF = (data: ExportData[], title: string, columns: ExportColumn[]): void => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Table
  const tableData: (string | number | null | undefined)[][] = data.map((item: ExportData) => 
    columns.map((col: ExportColumn) => {
      const value = item[col.key];
      // Convertir valores a string o número, manejar nulos/undefined
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' || typeof value === 'number') return value;
      return String(value);
    })
  );
  
  const tableConfig: PDFTableConfig = {
    startY: 40,
    head: [columns.map((col: ExportColumn) => col.header)],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 'auto' }
    },
    margin: { top: 40 }
  };
  
  (doc as any).autoTable(tableConfig);
  
  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const exportToExcel = (data: ExportData[], title: string, columns: ExportColumn[]): void => {
  const transformedData = data.map((item: ExportData) => {
    const row: Record<string, any> = {};
    columns.forEach((col: ExportColumn) => {
      row[col.header] = item[col.key];
    });
    return row;
  });
  
  const ws = XLSX.utils.json_to_sheet(transformedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const exportData = (
  data: ExportData[], 
  title: string, 
  columns: ExportColumn[], 
  format: ExportFormat = 'pdf'
): void => {
  switch (format.toLowerCase() as ExportFormat) {
    case 'pdf':
      exportToPDF(data, title, columns);
      break;
    case 'excel':
      exportToExcel(data, title, columns);
      break;
    default:
      throw new Error(`Formato no soportado: ${format}`);
  }
};