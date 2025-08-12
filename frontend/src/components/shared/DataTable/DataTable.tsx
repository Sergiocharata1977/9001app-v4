import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  List,
  Grid3X3,
  BarChart3,
  Trello,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ========== TIPOS ==========
export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface Action<T = any> {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export interface KanbanColumn<T = any> {
  key: string;
  label: string;
  color: string;
  filter: (row: T) => boolean;
}

export interface DataTableProps<T = any> {
  // Datos
  data: T[];
  columns: Column<T>[];
  
  // Carga
  loading?: boolean;
  error?: string | null;
  
  // Acciones
  actions?: Action<T>[];
  onRefresh?: () => void;
  onCreate?: () => void;
  
  // Búsqueda y filtros
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  filters?: React.ReactNode;
  
  // Paginación
  paginated?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Selección
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Exportación
  exportable?: boolean;
  onExport?: (data: T[]) => void;
  
  // Personalización
  title?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  
  // Identificador único de fila
  rowKey?: string | ((row: T) => string | number);
  
  // Vistas múltiples
  viewModes?: ('list' | 'grid' | 'kanban')[];
  defaultView?: 'list' | 'grid' | 'kanban';
  
  // Configuración Kanban
  kanbanColumns?: KanbanColumn<T>[];
  
  // Configuración Grid
  gridColumns?: number;
  
  // Renderizado personalizado para vistas
  renderCard?: (row: T, actions: Action<T>[]) => React.ReactNode;
  renderKanbanCard?: (row: T, actions: Action<T>[]) => React.ReactNode;
  
  // Eventos de vista
  onCardClick?: (row: T) => void;
  onKanbanCardMove?: (row: T, fromColumn: string, toColumn: string) => void;
}

// ========== COMPONENTE PRINCIPAL ==========
export function DataTable<T extends Record<string, any>>({
  data = [],
  columns = [],
  loading = false,
  error = null,
  actions = [],
  onRefresh,
  onCreate,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  searchFields = [],
  filters,
  paginated = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  selectable = false,
  onSelectionChange,
  exportable = false,
  onExport,
  title,
  description,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  striped = true,
  bordered = false,
  compact = false,
  rowKey = 'id',
  viewModes = ['list'],
  defaultView = 'list',
  kanbanColumns = [],
  gridColumns = 4,
  renderCard,
  renderKanbanCard,
  onCardClick,
  onKanbanCardMove,
}: DataTableProps<T>) {
  // ========== ESTADO ==========
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>(defaultView);

  // ========== FUNCIONES AUXILIARES ==========
  const getRowKey = useCallback((row: T): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return row[rowKey];
  }, [rowKey]);

  const getValue = useCallback((row: T, key: string): any => {
    const keys = key.split('.');
    let value: any = row;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }, []);

  // ========== FILTRADO Y BÚSQUEDA ==========
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const searchLower = searchTerm.toLowerCase();
    const fieldsToSearch = searchFields.length > 0 
      ? searchFields 
      : columns.map(col => col.key);

    return data.filter(row => {
      return fieldsToSearch.some(field => {
        const value = getValue(row, field);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchTerm, searchFields, columns, getValue]);

  // ========== ORDENAMIENTO ==========
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, sortColumn);
      const bValue = getValue(b, sortColumn);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection, getValue]);

  // ========== PAGINACIÓN ==========
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // ========== MANEJO DE EVENTOS ==========
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      const newSelection = new Set(paginatedData.map(row => getRowKey(row)));
      setSelectedRows(newSelection);
    }
  };

  const handleSelectRow = (row: T) => {
    const key = getRowKey(row);
    const newSelection = new Set(selectedRows);
    
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    
    setSelectedRows(newSelection);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(sortedData);
    } else {
      // Exportación básica a CSV
      const csv = [
        columns.map(col => col.label).join(','),
        ...sortedData.map(row => 
          columns.map(col => {
            const value = getValue(row, col.key);
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // ========== RENDERIZADO DE VISTAS ==========
  
  // Renderizado por defecto de tarjeta
  const renderDefaultCard = (row: T, actions: Action<T>[]) => {
    const key = getRowKey(row);
    const isSelected = selectedRows.has(key);
    
    return (
      <Card 
        key={key}
        className={`
          hover:shadow-md transition-shadow cursor-pointer
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
        onClick={() => onCardClick?.(row)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            {columns.slice(0, 3).map((column) => {
              const value = getValue(row, column.key);
              const content = column.render ? column.render(value, row) : value;
              
              return (
                <div key={column.key} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {column.label}:
                  </span>
                  <span className="text-sm">{content}</span>
                </div>
              );
            })}
          </div>
          
          {actions.length > 0 && (
            <div className="flex gap-1 mt-3 pt-3 border-t">
              {actions.map((action, actionIndex) => {
                if (action.show && !action.show(row)) {
                  return null;
                }

                const Icon = action.icon;
                return (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    className={action.className}
                    title={action.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Renderizado por defecto de tarjeta Kanban
  const renderDefaultKanbanCard = (row: T, actions: Action<T>[]) => {
    const key = getRowKey(row);
    
    return (
      <Card 
        key={key}
        className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onCardClick?.(row)}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            {columns.slice(0, 2).map((column) => {
              const value = getValue(row, column.key);
              const content = column.render ? column.render(value, row) : value;
              
              return (
                <div key={column.key}>
                  <span className="text-xs font-medium text-muted-foreground">
                    {column.label}
                  </span>
                  <div className="text-sm mt-1">{content}</div>
                </div>
              );
            })}
          </div>
          
          {actions.length > 0 && (
            <div className="flex gap-1 mt-3 pt-2 border-t">
              {actions.map((action, actionIndex) => {
                if (action.show && !action.show(row)) {
                  return null;
                }

                const Icon = action.icon;
                return (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    className={`${action.className} h-6 w-6 p-0`}
                    title={action.label}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Vista Grid
  const renderGridView = () => {
    const displayData = paginated ? paginatedData : sortedData;
    
    if (loading) {
      return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns} gap-4`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (displayData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns} gap-4`}>
        {displayData.map((row) => {
          const cardRenderer = renderCard || renderDefaultCard;
          return cardRenderer(row, actions);
        })}
      </div>
    );
  };

  // Vista Kanban
  const renderKanbanView = () => {
    const displayData = paginated ? paginatedData : sortedData;
    
    if (loading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-80 flex-shrink-0">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, cardIndex) => (
                  <Skeleton key={cardIndex} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (kanbanColumns.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No hay columnas configuradas para la vista Kanban
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((column) => {
          const columnData = displayData.filter(column.filter);
          
          return (
            <div key={column.key} className="w-80 flex-shrink-0">
              <div className={`p-3 rounded-t-lg ${column.color}`}>
                <h3 className="font-semibold text-white">
                  {column.label}
                  <span className="ml-2 text-sm bg-white/20 rounded-full px-2 py-0.5">
                    {columnData.length}
                  </span>
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-b-lg min-h-[400px]">
                {columnData.length > 0 ? (
                  <div className="space-y-3">
                    {columnData.map((row) => {
                      const cardRenderer = renderKanbanCard || renderDefaultKanbanCard;
                      return cardRenderer(row, actions);
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No hay elementos en esta columna
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ========== EFECTOS ==========
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  useEffect(() => {
    if (onSelectionChange) {
      const selected = paginatedData.filter(row => 
        selectedRows.has(getRowKey(row))
      );
      onSelectionChange(selected);
    }
  }, [selectedRows, paginatedData, getRowKey, onSelectionChange]);

  // ========== RENDERIZADO ==========
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center text-red-500">
            <p className="mb-4">{error}</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {/* Header */}
      {(title || description || searchable || onCreate || onRefresh || exportable) && (
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            {/* Título y descripción */}
            {(title || description) && (
              <div>
                {title && <CardTitle>{title}</CardTitle>}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
            )}

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Búsqueda */}
              {searchable && (
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              )}

              {/* Filtros personalizados */}
              {filters && <div className="flex gap-2">{filters}</div>}

              {/* Controles de vista */}
              {viewModes.length > 1 && (
                <div className="flex items-center bg-muted rounded-lg p-1">
                  {viewModes.includes('list') && (
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3"
                    >
                      <List className="h-4 w-4 mr-2" />
                      Lista
                    </Button>
                  )}
                  {viewModes.includes('grid') && (
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Tarjetas
                    </Button>
                  )}
                  {viewModes.includes('kanban') && (
                    <Button
                      variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('kanban')}
                      className="h-8 px-3"
                    >
                      <Trello className="h-4 w-4 mr-2" />
                      Kanban
                    </Button>
                  )}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2 ml-auto">
                {exportable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={sortedData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                )}
                {onRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                  </Button>
                )}
                {onCreate && (
                  <Button size="sm" onClick={onCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent>
        {/* Renderizado condicional según vista */}
        {viewMode === 'list' && (
          <div className={`rounded-md ${bordered ? 'border' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Checkbox para selección */}
                  {selectable && (
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                  )}

                  {/* Columnas */}
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`${column.className || ''} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className={`flex items-center gap-1 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                        {column.label}
                        {column.sortable && sortColumn === column.key && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  ))}

                  {/* Columna de acciones */}
                  {actions.length > 0 && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {selectable && (
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell>
                          <Skeleton className="h-8 w-20 ml-auto" />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : paginatedData.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  paginatedData.map((row, rowIndex) => {
                    const key = getRowKey(row);
                    const isSelected = selectedRows.has(key);

                    return (
                      <TableRow
                        key={key}
                        className={`
                          ${striped && rowIndex % 2 === 0 ? 'bg-muted/50' : ''}
                          ${isSelected ? 'bg-primary/10' : ''}
                          ${compact ? 'h-10' : ''}
                        `}
                      >
                        {/* Checkbox */}
                        {selectable && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(row)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                        )}

                        {/* Celdas de datos */}
                        {columns.map((column) => {
                          const value = getValue(row, column.key);
                          const content = column.render ? column.render(value, row) : value;

                          return (
                            <TableCell
                              key={column.key}
                              className={`${column.className || ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                            >
                              {content}
                            </TableCell>
                          );
                        })}

                        {/* Acciones */}
                        {actions.length > 0 && (
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              {actions.map((action, actionIndex) => {
                                if (action.show && !action.show(row)) {
                                  return null;
                                }

                                const Icon = action.icon;

                                return (
                                  <Button
                                    key={actionIndex}
                                    variant={action.variant || 'ghost'}
                                    size="sm"
                                    onClick={() => action.onClick(row)}
                                    className={action.className}
                                    title={action.label}
                                  >
                                    <Icon className="h-4 w-4" />
                                    <span className="sr-only">{action.label}</span>
                                  </Button>
                                );
                              })}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Vista Grid */}
        {viewMode === 'grid' && renderGridView()}

        {/* Vista Kanban */}
        {viewMode === 'kanban' && renderKanbanView()}

        {/* Paginación */}
        {paginated && totalPages > 1 && viewMode === 'list' && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length}
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Números de página */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ========== EXPORT DEFAULT PARA COMPATIBILIDAD ==========
export default DataTable;

