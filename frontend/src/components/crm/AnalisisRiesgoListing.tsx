import React, { useState, useEffect } from 'react';
import { DataTable, Column, Action } from '@/components/shared/DataTable/DataTable';
import analisisRiesgoService, { AnalisisRiesgo } from '@/services/analisisRiesgoService';
import { toast } from 'sonner';
import { Edit, Trash2, Eye, BarChart3, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalisisRiesgoModal from './AnalisisRiesgoModal';
import AnalisisRiesgoKanbanBoard from './AnalisisRiesgoKanbanBoard';

export function AnalisisRiesgoListing() {
  const [analisisRiesgo, setAnalisisRiesgo] = useState<AnalisisRiesgo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnalisis, setSelectedAnalisis] = useState<AnalisisRiesgo | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Definir columnas para la tabla
  const columns: Column<AnalisisRiesgo>[] = [
    {
      key: 'periodo_analisis',
      label: 'Período',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="font-semibold text-sm">{value}</span>
      )
    },
    {
      key: 'cliente_id',
      label: 'Cliente',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'puntaje_riesgo',
      label: 'Puntaje',
      sortable: true,
      width: '100px',
      render: (value) => (
        <div className="flex items-center gap-1">
          {value >= 80 ? <TrendingUp className="w-3 h-3 text-red-500" /> :
           value >= 60 ? <TrendingUp className="w-3 h-3 text-orange-500" /> :
           value >= 40 ? <TrendingDown className="w-3 h-3 text-yellow-500" /> :
           <TrendingDown className="w-3 h-3 text-green-500" />}
          <span className="font-semibold">{value}/100</span>
        </div>
      )
    },
    {
      key: 'categoria_riesgo',
      label: 'Categoría',
      sortable: true,
      width: '120px',
      render: (value) => {
        const config = {
          baja: { variant: 'default' as const, color: 'bg-green-100 text-green-700' },
          media: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-700' },
          alta: { variant: 'outline' as const, color: 'bg-orange-100 text-orange-700' },
          muy_alta: { variant: 'destructive' as const, color: 'bg-red-100 text-red-700' }
        };
        const configItem = config[value as keyof typeof config] || config.baja;
        return (
          <Badge variant={configItem.variant} className={`text-xs ${configItem.color}`}>
            {value.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      width: '120px',
      render: (value) => {
        const config = {
          identificado: { color: 'bg-red-100 text-red-700' },
          evaluado: { color: 'bg-orange-100 text-orange-700' },
          mitigado: { color: 'bg-yellow-100 text-yellow-700' },
          monitoreado: { color: 'bg-blue-100 text-blue-700' },
          cerrado: { color: 'bg-green-100 text-green-700' }
        };
        const configItem = config[value as keyof typeof config] || { color: 'bg-gray-100 text-gray-700' };
        return (
          <Badge variant="outline" className={`text-xs ${configItem.color}`}>
            {value.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      key: 'capacidad_pago',
      label: 'Capacidad Pago',
      sortable: true,
      width: '140px',
      render: (value) => (
        <span className="font-mono text-sm">
          ${value ? value.toLocaleString() : '0'}
        </span>
      )
    },
    {
      key: 'margen_utilidad',
      label: 'Margen',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={`font-semibold text-sm ${
          value > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {value > 0 ? '+' : ''}{value ? value.toFixed(1) : '0'}%
        </span>
      )
    },
    {
      key: 'fecha_analisis',
      label: 'Fecha',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

  // Acciones de la tabla
  const actions: Action<AnalisisRiesgo>[] = [
    {
      icon: Eye,
      label: 'Ver',
      onClick: (row) => handleView(row),
      variant: 'ghost' as const
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: (row) => handleEdit(row),
      variant: 'ghost' as const
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: (row) => handleDelete(row),
      variant: 'ghost' as const,
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  // Cargar datos
  const fetchAnalisisRiesgo = async () => {
    try {
      setLoading(true);
      const response = await analisisRiesgoService.getAll();
      setAnalisisRiesgo(response || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar análisis de riesgo');
      toast.error('Error al cargar los análisis de riesgo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalisisRiesgo();
  }, []);

  // Manejadores de eventos
  const handleCreate = () => {
    setSelectedAnalisis(null);
    setModalOpen(true);
  };

  const handleEdit = (analisis: AnalisisRiesgo) => {
    setSelectedAnalisis(analisis);
    setModalOpen(true);
  };

  const handleView = (analisis: AnalisisRiesgo) => {
    setSelectedAnalisis(analisis);
    setModalOpen(true);
  };

  const handleDelete = async (analisis: AnalisisRiesgo) => {
    if (window.confirm(`¿Estás seguro de eliminar el análisis de ${analisis.periodo_analisis}?`)) {
      try {
        await analisisRiesgoService.delete(analisis.id);
        toast.success('Análisis de riesgo eliminado correctamente');
        fetchAnalisisRiesgo();
      } catch (err: any) {
        toast.error(err.message || 'Error al eliminar el análisis de riesgo');
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAnalisis(null);
  };

  const handleModalSave = async (data: any) => {
    try {
      if (selectedAnalisis) {
        await analisisRiesgoService.update(selectedAnalisis.id, data);
        toast.success('Análisis de riesgo actualizado correctamente');
      } else {
        await analisisRiesgoService.create(data);
        toast.success('Análisis de riesgo creado correctamente');
      }
      handleModalClose();
      fetchAnalisisRiesgo();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el análisis de riesgo');
    }
  };

  const handleEstadoChange = async (analisisId: string, newEstado: string) => {
    try {
      await analisisRiesgoService.updateEstado(analisisId, newEstado);
      toast.success('Estado actualizado correctamente');
      fetchAnalisisRiesgo();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar el estado');
    }
  };

  // Estadísticas
  const estadisticas = {
    total: analisisRiesgo.length,
    riesgosAltos: analisisRiesgo.filter(a => a.categoria_riesgo === 'alta' || a.categoria_riesgo === 'muy_alta').length,
    promedioPuntaje: analisisRiesgo.length > 0 
      ? Math.round(analisisRiesgo.reduce((sum, a) => sum + a.puntaje_riesgo, 0) / analisisRiesgo.length)
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando análisis de riesgo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={fetchAnalisisRiesgo}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis de Riesgo CRM</h1>
          <p className="text-gray-600">Gestión y seguimiento de análisis de riesgo de clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tabla
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </Button>
          <Button onClick={handleCreate}>
            Nuevo Análisis
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Análisis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Riesgos Altos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estadisticas.riesgosAltos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Promedio Puntaje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.promedioPuntaje}/100</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido */}
      {viewMode === 'table' ? (
        <DataTable
          data={analisisRiesgo}
          columns={columns}
          actions={actions}
          searchable
          pagination
          onRefresh={fetchAnalisisRiesgo}
          emptyMessage="No se encontraron análisis de riesgo. Haz clic en 'Nuevo Análisis' para comenzar."
        />
      ) : (
        <AnalisisRiesgoKanbanBoard
          analisisRiesgo={analisisRiesgo}
          onCardClick={handleView}
          onAnalisisStateChange={handleEstadoChange}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <AnalisisRiesgoModal
          analisis={selectedAnalisis}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default AnalisisRiesgoListing;
