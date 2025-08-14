import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Target,
  Clock,
  Building,
  CheckCircle
} from 'lucide-react';
import { auditoriasService } from '../../services/auditoriasService.js';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast.js';
import DataTable from '../shared/DataTable/DataTable';

// ===============================================
// COMPONENTE DE LISTADO DE AUDITORÍAS - REFACTORIZADO CON DATATABLE
// ===============================================

const AuditoriasListingNEW = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados de auditoría con configuraciones de colores
  const estadoConfigs = {
    planificacion: { 
      colorClasses: 'bg-blue-100 text-blue-800 border-blue-200', 
      label: 'Planificación',
      bgColor: 'bg-blue-50'
    },
    programacion: { 
      colorClasses: 'bg-purple-100 text-purple-800 border-purple-200', 
      label: 'Programación',
      bgColor: 'bg-purple-50'
    },
    ejecucion: { 
      colorClasses: 'bg-orange-100 text-orange-800 border-orange-200', 
      label: 'Ejecución',
      bgColor: 'bg-orange-50'
    },
    informe: { 
      colorClasses: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      label: 'Informe',
      bgColor: 'bg-yellow-50'
    },
    seguimiento: { 
      colorClasses: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      label: 'Seguimiento',
      bgColor: 'bg-indigo-50'
    },
    cerrada: { 
      colorClasses: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Cerrada',
      bgColor: 'bg-green-50'
    },
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAuditorias();
  }, []);

  const loadAuditorias = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [AuditoriasListingNEW] Cargando auditorías...');
      
      const data = await auditoriasService.getAllAuditorias();
      console.log('📊 [AuditoriasListingNEW] Datos recibidos:', data);
      
      if (Array.isArray(data)) {
        setAuditorias(data);
        console.log(`✅ [AuditoriasListingNEW] ${data.length} auditorías cargadas exitosamente`);
      } else {
        console.warn('⚠️ [AuditoriasListingNEW] Los datos no son un array:', data);
        setAuditorias([]);
      }
      
    } catch (err) {
      console.error('❌ [AuditoriasListingNEW] Error cargando auditorías:', err);
      setError('Error al cargar las auditorías');
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las auditorías. Mostrando datos de ejemplo.",
      });
      setAuditorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (auditoria) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta auditoría?')) {
      try {
        await auditoriasService.deleteAuditoria(auditoria.id);
        toast({
          title: "Éxito",
          description: "Auditoría eliminada correctamente",
        });
        await loadAuditorias();
      } catch (err) {
        console.error('Error eliminando auditoría:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar la auditoría",
        });
      }
    }
  };

  const handleEdit = (auditoria) => {
    console.log('Editar auditoría:', auditoria);
    toast({
      title: "Función en desarrollo",
      description: "La edición de auditorías estará disponible pronto",
    });
  };

  const handleCreate = () => {
    console.log('Crear nueva auditoría');
    toast({
      title: "Función en desarrollo", 
      description: "La creación de auditorías estará disponible pronto",
    });
  };

  const handleAuditoriaStateChange = async (auditoriaId, newEstado) => {
    try {
      console.log(`Cambiando estado de auditoría ${auditoriaId} a ${newEstado}`);
      // TODO: Implementar el cambio de estado en el backend
      toast({
        title: "Función en desarrollo",
        description: `Cambio de estado a ${newEstado} estará disponible pronto`,
      });
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar el estado de la auditoría",
      });
    }
  };

  const handleCardClick = (auditoria) => {
    console.log('🔗 Card clicked - navegando a auditoría:', auditoria.id);
    console.log('🧭 Navegando a ruta:', `/app/auditorias/${auditoria.id}`);
    navigate(`/app/auditorias/${auditoria.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getEstadoConfig = (estado) => {
    return estadoConfigs[estado] || {
      colorClasses: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Sin estado',
      bgColor: 'bg-gray-50'
    };
  };

  const formatAreas = (areas) => {
    if (!areas) return 'Sin área';
    if (Array.isArray(areas)) {
      return areas.length > 0 ? areas.join(', ') : 'Sin área';
    }
    if (typeof areas === 'string') {
      try {
        const parsedAreas = JSON.parse(areas);
        return Array.isArray(parsedAreas) ? parsedAreas.join(', ') : areas;
      } catch {
        return areas;
      }
    }
    return String(areas);
  };

  // Definición de columnas para el DataTable
  const columns = [
    {
      key: 'codigo',
      label: 'Código',
      sortable: true,
      filterable: true,
      width: '200px',
      render: (value, row) => (
        <div className="font-semibold text-gray-800">
          {value || 'Sin código'}
        </div>
      )
    },
    {
      key: 'titulo',
      label: 'Título',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900">{value || 'Sin título'}</div>
          {row.descripcion && (
            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
              {row.descripcion}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value, row) => {
        const config = getEstadoConfig(value);
        return (
          <Badge className={`text-xs font-medium px-2 py-1 ${config.colorClasses}`}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'auditor_lider',
      label: 'Auditor Líder',
      sortable: true,
      filterable: true,
      width: '180px',
      render: (value, row) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm">{value || 'No asignado'}</span>
        </div>
      )
    },
    {
      key: 'areas',
      label: 'Áreas',
      sortable: false,
      filterable: true,
      width: '200px',
      render: (value, row) => (
        <div className="flex items-center">
          <Target className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 truncate max-w-32">
            {formatAreas(value)}
          </span>
        </div>
      )
    },
    {
      key: 'fecha_programada',
      label: 'Fecha Programada',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value, row) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm">{formatDate(value)}</span>
        </div>
      )
    },
    {
      key: 'duracion_estimada',
      label: 'Duración',
      sortable: false,
      filterable: true,
      width: '120px',
      render: (value, row) => (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm">{value || 'No definida'}</span>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value, row) => (
        <div className="flex items-center">
          <Building className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm capitalize">{value || 'No definido'}</span>
        </div>
      )
    }
  ];

  // Definición de acciones
  const actions = [
    {
      icon: Eye,
      label: 'Ver',
      onClick: (auditoria) => navigate(`/app/auditorias/${auditoria.id}`),
      variant: 'ghost',
      className: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: handleEdit,
      variant: 'ghost',
      className: 'text-green-600 hover:text-green-700 hover:bg-green-50'
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: handleDelete,
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
    }
  ];

  // Definición de columnas Kanban
  const kanbanColumns = [
    {
      key: 'planificacion',
      label: 'Planificación',
      color: 'bg-blue-500',
      filter: (auditoria) => auditoria.estado === 'planificacion'
    },
    {
      key: 'programacion',
      label: 'Programación',
      color: 'bg-purple-500',
      filter: (auditoria) => auditoria.estado === 'programacion'
    },
    {
      key: 'ejecucion',
      label: 'Ejecución',
      color: 'bg-orange-500',
      filter: (auditoria) => auditoria.estado === 'ejecucion'
    },
    {
      key: 'informe',
      label: 'Informe',
      color: 'bg-yellow-500',
      filter: (auditoria) => auditoria.estado === 'informe'
    },
    {
      key: 'seguimiento',
      label: 'Seguimiento',
      color: 'bg-indigo-500',
      filter: (auditoria) => auditoria.estado === 'seguimiento'
    },
    {
      key: 'cerrada',
      label: 'Cerrada',
      color: 'bg-green-500',
      filter: (auditoria) => auditoria.estado === 'cerrada'
    }
  ];

  // Renderizado personalizado para tarjetas
  const renderCard = (auditoria, actions) => {
    const estadoConfig = getEstadoConfig(auditoria.estado);
    
    return (
      <div className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 h-full cursor-pointer hover:bg-gray-50 rounded-lg">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {auditoria.codigo || 'Sin código'}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {auditoria.titulo || 'Sin título'}
              </p>
              <Badge className={`text-xs font-medium px-2 py-1 ${estadoConfig.colorClasses}`}>
                {estadoConfig.label}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start text-sm text-gray-700">
              <Target className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Áreas:</span>
                <span className="ml-1 block text-gray-600">
                  {formatAreas(auditoria.areas)}
                </span>
              </div>
            </div>
            
            <div className="flex items-start text-sm text-gray-700">
              <User className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Auditor Líder:</span>
                <span className="ml-1 block text-gray-600">
                  {auditoria.auditor_lider || 'No asignado'}
                </span>
              </div>
            </div>
            
            <div className="flex items-start text-sm text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Fecha Programada:</span>
                <span className="ml-1 block text-gray-600">
                  {formatDate(auditoria.fecha_programada)}
                </span>
              </div>
            </div>

            {auditoria.duracion_estimada && (
              <div className="flex items-start text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Duración:</span>
                  <span className="ml-1 block text-gray-600">
                    {auditoria.duracion_estimada}
                  </span>
                </div>
              </div>
            )}

            {auditoria.tipo && (
              <div className="flex items-start text-sm text-gray-700">
                <Building className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Tipo:</span>
                  <span className="ml-1 block text-gray-600 capitalize">
                    {auditoria.tipo}
                  </span>
                </div>
              </div>
            )}
            
            {auditoria.descripcion && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {auditoria.descripcion}
              </p>
            )}
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
            {actions.map((action, actionIndex) => {
              const Icon = action.icon;
              return (
                <Button
                  key={actionIndex}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(auditoria);
                  }}
                  className={action.className}
                  title={action.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="sr-only">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizado personalizado para tarjetas Kanban
  const renderKanbanCard = (auditoria, actions) => {
    const estadoConfig = getEstadoConfig(auditoria.estado);
    
    return (
      <div className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-lg mb-3">
        <div className="p-3">
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                {auditoria.codigo || 'Sin código'}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-1">
                {auditoria.titulo || 'Sin título'}
              </p>
            </div>
            
            <div className="flex items-center text-xs text-gray-700">
              <User className="w-3 h-3 mr-1 text-gray-500" />
              <span className="truncate">
                {auditoria.auditor_lider || 'No asignado'}
              </span>
            </div>
            
            <div className="flex items-center text-xs text-gray-700">
              <Calendar className="w-3 h-3 mr-1 text-gray-500" />
              <span>{formatDate(auditoria.fecha_programada)}</span>
            </div>
          </div>
          
          {actions.length > 0 && (
            <div className="flex gap-1 mt-3 pt-2 border-t">
              {actions.map((action, actionIndex) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(auditoria);
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
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Sistema de Auditorías ISO 9001
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona y controla todas las auditorías del sistema de calidad
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>Total: {auditorias.length} auditorías</span>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={auditorias}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={loadAuditorias}
        onCreate={handleCreate}
        searchable={true}
        searchPlaceholder="Buscar auditorías..."
        searchFields={['codigo', 'titulo', 'auditor_lider', 'descripcion']}
        paginated={true}
        pageSize={12}
        exportable={true}
        title="Auditorías"
        description="Lista completa de auditorías del sistema"
        emptyMessage="No hay auditorías registradas"
        className="w-full"
        striped={true}
        bordered={false}
        compact={false}
        rowKey="id"
        viewModes={['list', 'grid', 'kanban']}
        defaultView="grid"
        kanbanColumns={kanbanColumns}
        gridColumns={4}
        renderCard={renderCard}
        renderKanbanCard={renderKanbanCard}
        onCardClick={handleCardClick}
        onKanbanCardMove={handleAuditoriaStateChange}
      />
    </div>
  );
};

export default AuditoriasListingNEW;
