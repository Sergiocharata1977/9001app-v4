import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Database, ChevronDown } from "lucide-react";
import { exportToCSV, exportToExcel, exportToJSON, ExportOptions, ExportColumn } from '@/utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns?: ExportColumn[];
  disabled?: boolean;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  columns,
  disabled = false,
  className = ""
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    if (!data || data.length === 0) {
      return;
    }

    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        filename,
        columns,
        includeHeaders: true
      };

      switch (format) {
        case 'csv':
          exportToCSV(data, options);
          break;
        case 'excel':
          exportToExcel(data, { ...options, sheetName: 'Datos' });
          break;
        case 'json':
          exportToJSON(data, options);
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isExporting}
          className={`bg-slate-700 border-slate-600 text-white hover:bg-slate-600 ${className}`}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-700">
        <DropdownMenuItem
          onClick={() => handleExport('excel')}
          className="text-white hover:bg-slate-700 cursor-pointer"
        >
          <Table className="h-4 w-4 mr-2" />
          Exportar a Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className="text-white hover:bg-slate-700 cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportar a CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('json')}
          className="text-white hover:bg-slate-700 cursor-pointer"
        >
          <Database className="h-4 w-4 mr-2" />
          Exportar a JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
