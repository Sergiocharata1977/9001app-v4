import React, { useState, useCallback } from 'react';
import { Download, FileText, Table, BarChart3, Calendar, Filter, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { exportToPDF, exportToExcel } from '@/utils/export';

/**
 * Componente de exportación masiva mejorada
 * Complementa el sistema de exportación existente
 */
const BulkExport = ({ 
  data = [], 
  columns = [], 
  title = 'Exportar Datos',
  onExport,
  exportFormats = ['excel', 'pdf'],
  showFilters = true,
  showProgress = true
}) => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.key));
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  const handleExport = useCallback(async () => {
    if (!data || data.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Filtrar datos según los filtros aplicados
      let filteredData = [...data];
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          filteredData = filteredData.filter(item => {
            const itemValue = item[key];
            if (typeof value === 'string') {
              return String(itemValue).toLowerCase().includes(value.toLowerCase());
            }
            return itemValue === value;
          });
        }
      });

      // Filtrar columnas seleccionadas
      const filteredColumns = columns.filter(col => selectedColumns.includes(col.key));

      // Ejecutar exportación
      if (onExport) {
        await onExport(filteredData, filteredColumns, selectedFormat);
      } else {
        // Exportación por defecto
        if (selectedFormat === 'excel') {
          exportToExcel(filteredData, title, filteredColumns);
        } else if (selectedFormat === 'pdf') {
          exportToPDF(filteredData, title, filteredColumns);
        }
      }

      setProgress(100);
      
      toast({
        title: "Éxito",
        description: `Datos exportados exitosamente en formato ${selectedFormat.toUpperCase()}`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error en exportación:', error);
      toast({
        title: "Error",
        description: "Error al exportar los datos",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, [data, columns, selectedFormat, selectedColumns, filters, title, onExport, toast]);

  const toggleColumn = useCallback((columnKey) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const getFilteredDataCount = () => {
    let filteredData = [...data];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key];
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          }
          return itemValue === value;
        });
      }
    });
    
    return filteredData.length;
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: Table },
    { value: 'pdf', label: 'PDF (.pdf)', icon: FileText },
    { value: 'csv', label: 'CSV (.csv)', icon: Table }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="outline">{getFilteredDataCount()} registros</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Formato de exportación */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Formato de exportación</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formatOptions
              .filter(format => exportFormats.includes(format.value))
              .map((format) => {
                const Icon = format.icon;
                return (
                  <Button
                    key={format.value}
                    variant={selectedFormat === format.value ? "default" : "outline"}
                    onClick={() => setSelectedFormat(format.value)}
                    className="justify-start"
                    disabled={isExporting}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {format.label}
                  </Button>
                );
              })}
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Filtros</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={Object.keys(filters).length === 0}
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {columns.slice(0, 6).map((column) => (
                <div key={column.key} className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    {column.label}
                  </label>
                  <input
                    type="text"
                    placeholder={`Filtrar ${column.label.toLowerCase()}`}
                    value={filters[column.key] || ''}
                    onChange={(e) => updateFilter(column.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isExporting}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selección de columnas */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Columnas a exportar</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {columns.map((column) => (
              <label
                key={column.key}
                className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.key)}
                  onChange={() => toggleColumn(column.key)}
                  disabled={isExporting}
                  className="rounded"
                />
                <span className="text-sm">{column.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Progreso */}
        {showProgress && isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Exportando...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Botón de exportación */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedColumns.length} columnas seleccionadas
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.length === 0}
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Información de exportación:</p>
              <ul className="mt-1 space-y-1">
                <li>• Los datos se exportarán con los filtros aplicados</li>
                <li>• Solo se incluirán las columnas seleccionadas</li>
                <li>• El archivo se descargará automáticamente</li>
                {selectedFormat === 'pdf' && (
                  <li>• El PDF incluirá formato de tabla optimizado</li>
                )}
                {selectedFormat === 'excel' && (
                  <li>• El Excel incluirá múltiples hojas si es necesario</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkExport;
