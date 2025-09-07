import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Filter, X, Plus, Calendar, User, Building2, 
  Target, BarChart3, FileText, ChevronDown, ChevronUp
} from "lucide-react";

interface SearchFilter {
  field: string;
  operator: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter[]) => void;
  onClear: () => void;
  entityType: 'personal' | 'procesos' | 'indicadores' | 'objetivos' | 'mediciones';
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  entityType,
  className = ""
}) => {
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const getAvailableFields = () => {
    const fieldConfigs = {
      personal: [
        { field: 'nombre', label: 'Nombre', type: 'text' },
        { field: 'apellido', label: 'Apellido', type: 'text' },
        { field: 'email', label: 'Email', type: 'text' },
        { field: 'telefono', label: 'Teléfono', type: 'text' },
        { field: 'fecha_ingreso', label: 'Fecha de Ingreso', type: 'date' },
        { field: 'tipo_personal', label: 'Tipo de Personal', type: 'select', options: ['empleado', 'contratista', 'consultor', 'practicante'] },
        { field: 'estado', label: 'Estado', type: 'select', options: ['activo', 'inactivo'] }
      ],
      procesos: [
        { field: 'codigo', label: 'Código', type: 'text' },
        { field: 'nombre', label: 'Nombre', type: 'text' },
        { field: 'descripcion', label: 'Descripción', type: 'text' },
        { field: 'tipo', label: 'Tipo', type: 'select', options: ['estrategico', 'operativo', 'apoyo', 'mejora'] },
        { field: 'categoria', label: 'Categoría', type: 'select', options: ['proceso', 'subproceso', 'actividad'] },
        { field: 'nivel_critico', label: 'Nivel Crítico', type: 'select', options: ['bajo', 'medio', 'alto', 'critico'] },
        { field: 'estado', label: 'Estado', type: 'select', options: ['activo', 'inactivo'] },
        { field: 'fecha_vigencia', label: 'Fecha de Vigencia', type: 'date' },
        { field: 'fecha_revision', label: 'Fecha de Revisión', type: 'date' }
      ],
      indicadores: [
        { field: 'nombre', label: 'Nombre', type: 'text' },
        { field: 'descripcion', label: 'Descripción', type: 'text' },
        { field: 'tipo', label: 'Tipo', type: 'select', options: ['efectividad', 'eficiencia', 'satisfaccion', 'cumplimiento'] },
        { field: 'unidad', label: 'Unidad', type: 'text' },
        { field: 'meta', label: 'Meta', type: 'number' },
        { field: 'frecuencia', label: 'Frecuencia', type: 'select', options: ['diario', 'semanal', 'mensual', 'trimestral', 'anual'] },
        { field: 'estado', label: 'Estado', type: 'select', options: ['activo', 'inactivo'] }
      ],
      objetivos: [
        { field: 'codigo', label: 'Código', type: 'text' },
        { field: 'nombre_objetivo', label: 'Nombre del Objetivo', type: 'text' },
        { field: 'descripcion', label: 'Descripción', type: 'text' },
        { field: 'meta', label: 'Meta', type: 'text' },
        { field: 'responsable', label: 'Responsable', type: 'text' },
        { field: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date' },
        { field: 'fecha_limite', label: 'Fecha Límite', type: 'date' },
        { field: 'estado', label: 'Estado', type: 'select', options: ['activo', 'en_progreso', 'completado', 'pausado', 'cancelado'] },
        { field: 'prioridad', label: 'Prioridad', type: 'select', options: ['baja', 'media', 'alta', 'critica'] },
        { field: 'tipo', label: 'Tipo', type: 'select', options: ['mejora', 'prevencion', 'correccion', 'innovacion'] }
      ],
      mediciones: [
        { field: 'valor', label: 'Valor', type: 'number' },
        { field: 'fecha_medicion', label: 'Fecha de Medición', type: 'date' },
        { field: 'estado', label: 'Estado', type: 'select', options: ['completada', 'pendiente', 'rechazada'] },
        { field: 'confiabilidad', label: 'Confiabilidad', type: 'select', options: ['alta', 'media', 'baja'] },
        { field: 'metodo_medicion', label: 'Método de Medición', type: 'text' },
        { field: 'fuente_datos', label: 'Fuente de Datos', type: 'text' }
      ]
    };

    return fieldConfigs[entityType] || [];
  };

  const getOperators = (type: string) => {
    const operators = {
      text: [
        { value: 'contains', label: 'Contiene' },
        { value: 'equals', label: 'Igual a' },
        { value: 'starts_with', label: 'Empieza con' },
        { value: 'ends_with', label: 'Termina con' }
      ],
      number: [
        { value: 'equals', label: 'Igual a' },
        { value: 'greater_than', label: 'Mayor que' },
        { value: 'less_than', label: 'Menor que' },
        { value: 'between', label: 'Entre' }
      ],
      date: [
        { value: 'equals', label: 'Igual a' },
        { value: 'after', label: 'Después de' },
        { value: 'before', label: 'Antes de' },
        { value: 'between', label: 'Entre' }
      ],
      select: [
        { value: 'equals', label: 'Igual a' },
        { value: 'not_equals', label: 'Diferente de' },
        { value: 'in', label: 'En' }
      ]
    };

    return operators[type] || operators.text;
  };

  const addFilter = () => {
    const newFilter: SearchFilter = {
      field: '',
      operator: 'contains',
      value: '',
      type: 'text'
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof SearchFilter, value: string) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    
    // Si cambió el campo, actualizar el tipo y operador
    if (field === 'field') {
      const fieldConfig = getAvailableFields().find(f => f.field === value);
      if (fieldConfig) {
        updatedFilters[index].type = fieldConfig.type;
        updatedFilters[index].operator = getOperators(fieldConfig.type)[0].value;
      }
    }
    
    setFilters(updatedFilters);
  };

  const handleSearch = () => {
    if (globalSearch.trim()) {
      // Búsqueda global
      const globalFilter: SearchFilter = {
        field: 'global',
        operator: 'contains',
        value: globalSearch,
        type: 'text'
      };
      onSearch([globalFilter]);
    } else {
      // Búsqueda con filtros
      const validFilters = filters.filter(f => f.field && f.value);
      onSearch(validFilters);
    }
  };

  const handleClear = () => {
    setFilters([]);
    setGlobalSearch('');
    onClear();
  };

  const getFieldIcon = (field: string) => {
    if (field.includes('fecha') || field.includes('date')) return Calendar;
    if (field.includes('responsable') || field.includes('user')) return User;
    if (field.includes('departamento') || field.includes('organizacion')) return Building2;
    if (field.includes('objetivo') || field.includes('meta')) return Target;
    if (field.includes('indicador') || field.includes('valor')) return BarChart3;
    return FileText;
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'personal': return User;
      case 'procesos': return FileText;
      case 'indicadores': return BarChart3;
      case 'objetivos': return Target;
      case 'mediciones': return BarChart3;
      default: return Search;
    }
  };

  const EntityIcon = getEntityIcon();

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <EntityIcon className="h-5 w-5" />
          Búsqueda Avanzada - {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda global */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Búsqueda global..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtros avanzados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
              {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
            
            {filters.length > 0 && (
              <Badge variant="secondary" className="bg-slate-600 text-white">
                {filters.length} filtro{filters.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {isExpanded && (
            <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
              {filters.map((filter, index) => {
                const FieldIcon = getFieldIcon(filter.field);
                const fieldConfig = getAvailableFields().find(f => f.field === filter.field);
                
                return (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-600/50 rounded-lg">
                    <FieldIcon className="h-4 w-4 text-slate-400" />
                    
                    <Select
                      value={filter.field}
                      onValueChange={(value) => updateFilter(index, 'field', value)}
                    >
                      <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableFields().map((field) => (
                          <SelectItem key={field.field} value={field.field}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(index, 'operator', value)}
                    >
                      <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperators(filter.type).map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {filter.type === 'select' && fieldConfig?.options ? (
                      <Select
                        value={filter.value}
                        onValueChange={(value) => updateFilter(index, 'value', value)}
                      >
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Valor" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldConfig.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={filter.type === 'number' ? 'number' : filter.type === 'date' ? 'date' : 'text'}
                        placeholder="Valor"
                        value={filter.value}
                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                        className="w-40 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFilter(index)}
                      className="bg-red-600/20 border-red-600 text-red-400 hover:bg-red-600/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFilter}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Filtro
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSearch}
                  className="bg-teal-600/20 border-teal-600 text-teal-400 hover:bg-teal-600/30"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="bg-slate-600/20 border-slate-600 text-slate-400 hover:bg-slate-600/30"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
