import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Target,
  List,
  Grid3X3,
  BarChart3
} from 'lucide-react';
import { auditoriasService } from '../../services/auditoriasService.js';
import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { useNavigate } from 'react-router-dom';

// ===============================================
// COMPONENTE DE LISTADO DE AUDITORÍAS - SGC PRO
// ===============================================

const AuditoriasListing = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'grid', 'list'
  const navigate = useNavigate();

  // Estados de auditoría - definidos localmente
  const estados = [
    { value: 'planificacion', label: 'Planificación' },
    { value: 'programacion', label: 'Programación' }, 
    { value: 'ejecucion', label: 'Ejecución' },
    { value: 'informe', label: 'Informe' },
    { value: 'seguimiento', label: 'Seguimiento' },
    { value: 'cerrada', label: 'Cerrada' }
  ];

  const estadoConfigs = {
    planificacion: { colorClasses: 'bg-blue-100 dark:bg-blue-900/40', label: 'Planificación' },
    programacion: { colorClasses: 'bg-purple-100 dark:bg-purple-900/40', label: 'Programación' },
    ejecucion: { colorClasses: 'bg-orange-100 dark:bg-orange-900/40', label: 'Ejecución' },
    informe: { colorClasses: 'bg-yellow-100 dark:bg-yellow-900/40', label: 'Informe' },
    seguimiento: { colorClasses: 'bg-indigo-100 dark:bg-indigo-900/40', label: 'Seguimiento' },
    cerrada: { colorClasses: 'bg-green-100 dark:bg-green-900/40', label: 'Cerrada' },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 [AuditoriasListing] Iniciando carga de datos...');
      
      // Cargar auditorías
      const auditoriasData = await auditoriasService.getAllAuditorias();
      console.log('📊 [AuditoriasListing] Datos recibidos del servicio:', auditoriasData);
      
      setAuditorias(Array.isArray(auditoriasData) ? auditoriasData : []);
      
      console.log('✅ [AuditoriasListing] Auditorías cargadas exitosamente');
      
      console.log('✅ [AuditoriasListing] Auditorías cargadas:', auditoriasData?.length || 0);
      
    } catch (err) {
      console.error('❌ [AuditoriasListing] Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener nombres de departamentos desde áreas
  const getAreaNames = (areas) => {
    if (!areas) return 'Sin área';
    
    try {
      // Si es string, intentar parsear como JSON
      const areasArray = typeof areas === 'string' ? JSON.parse(areas) : areas;
      
      if (areasArray.includes('todos')) {
        return 'Todos los departamentos';
      }
      
      const areaNames = areasArray
        .map(areaId => {
          const depto = departamentos.find(d => d.id?.toString() === areaId?.toString());
          return depto?.nombre || `Departamento ${areaId}`;
        })
        .filter(name => name);
      
      return areaNames.length > 0 ? areaNames.join(', ') : 'Sin área';
    } catch (error) {
      console.error('Error parseando áreas:', error);
      return areas; // Devolver el valor original si no se puede parsear
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta auditoría?')) {
      try {
        await auditoriasService.deleteAuditoria(id);
        await loadData(); // Reload data after deletion
      } catch (err) {
        console.error('Error eliminando auditoría:', err);
        alert('Error al eliminar la auditoría');
      }
    }
  };

  const handleEdit = (auditoria) => {
    console.log('Editar auditoría:', auditoria);
    // Por ahora solo un log, después implementaremos el modal
  };

  const handleCreate = () => {
    console.log('Crear nueva auditoría');
    // Por ahora solo un log, después implementaremos el modal
  };

  const getAuditoriasByEstado = (estado) => {
    return auditorias.filter(audit => audit.estado === estado);
  };

  const getEstadoConfig = (estado) => {
    return estados.find(e => e.value === estado) || estados[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  // Componente de tarjeta de auditoría
  const AuditoriaCard = ({ auditoria }) => {
    const estadoConfig = getEstadoConfig(auditoria.estado);
    
    return (
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
                {auditoria.codigo || auditoria.titulo}
              </CardTitle>
              <Badge 
                className={`text-xs font-medium px-2 py-1 ${
                  estadoConfig.value === 'planificacion' ? 'bg-blue-100 text-blue-700' :
                  estadoConfig.value === 'programacion' ? 'bg-purple-100 text-purple-700' :
                  estadoConfig.value === 'ejecucion' ? 'bg-orange-100 text-orange-700' :
                  estadoConfig.value === 'informe' ? 'bg-yellow-100 text-yellow-700' :
                  estadoConfig.value === 'seguimiento' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-green-100 text-green-700'
                }`}
              >
                {estadoConfig.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <Target className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">Áreas:</span>
              <span className="ml-1">{Array.isArray(auditoria.areas) ? auditoria.areas.join(', ') : (auditoria.areas || 'Sin área')}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-700">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">Auditor Líder:</span>
              <span className="ml-1">{auditoria.auditor_lider || 'No asignado'}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">Fecha:</span>
              <span className="ml-1">{formatDate(auditoria.fecha_programada)}</span>
            </div>
            
            {auditoria.descripcion && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {auditoria.descripcion}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/app/auditorias/${auditoria.id}`)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(auditoria)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(auditoria.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Vista Kanban
  const KanbanView = () => (
    <div className="flex-grow overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ minWidth: `${Object.keys(estadoConfigs).length * 320}px` }}>
        {Object.entries(estadoConfigs).map(([estadoKey, config]) => (
          <div key={estadoKey} className={`flex flex-col w-80 flex-shrink-0 rounded-lg ${config.colorClasses}`}>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {config.label}
                <span className="ml-2 text-sm font-normal bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
                  {getAuditoriasByEstado(estadoKey).length}
                </span>
              </h3>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-black/5 dark:bg-black/10">
              {getAuditoriasByEstado(estadoKey).length > 0 ? (
                getAuditoriasByEstado(estadoKey).map(auditoria => (
                  <AuditoriaCard key={auditoria.id} auditoria={auditoria} />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  No hay auditorías en este estado
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Vista Grid
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auditorias.map((auditoria) => (
        <AuditoriaCard key={auditoria.id} auditoria={auditoria} />
      ))}
      
      {auditorias.length === 0 && (
        <div className="col-span-full text-center py-12 text-sgc-500">
          No hay auditorías registradas
        </div>
      )}
    </div>
  );

  // Vista Lista
  const ListView = () => (
    <div className="space-y-4">
      {auditorias.map((auditoria) => (
        <Card key={auditoria.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-sgc-800">
                    {auditoria.codigo || auditoria.titulo}
                  </h3>
                  <p className="text-sgc-600">{auditoria.descripcion}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-sgc-700">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {Array.isArray(auditoria.areas) ? auditoria.areas.join(', ') : (auditoria.areas || 'Sin área')}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {auditoria.auditor_lider || 'No asignado'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(auditoria.fecha_programada)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  className={`${
                    getEstadoConfig(auditoria.estado).value === 'planificacion' ? 'bg-blue-100 text-blue-700' :
                    getEstadoConfig(auditoria.estado).value === 'programacion' ? 'bg-purple-100 text-purple-700' :
                    getEstadoConfig(auditoria.estado).value === 'ejecucion' ? 'bg-orange-100 text-orange-700' :
                    getEstadoConfig(auditoria.estado).value === 'informe' ? 'bg-yellow-100 text-yellow-700' :
                    getEstadoConfig(auditoria.estado).value === 'seguimiento' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-green-100 text-green-700'
                  }`}
                >
                  {getEstadoConfig(auditoria.estado).label}
                </Badge>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/app/auditorias/${auditoria.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(auditoria)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(auditoria.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {auditorias.length === 0 && (
        <div className="text-center py-12 text-sgc-500">
          No hay auditorías registradas
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-sgc-600">Cargando auditorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Sistema de Administración de Auditorías ISO 9001
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona y controla todas las auditorías del sistema de calidad
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Controles de vista */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-blue-600'}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-blue-600'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className={viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-blue-600'}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Botón Nueva Auditoría */}
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Auditoría</span>
          </Button>
        </div>
      </div>

      {/* Contenido según vista */}
      <div className="flex flex-col flex-grow">
        {viewMode === 'kanban' && <KanbanView />}
        {viewMode === 'grid' && <GridView />}
        {viewMode === 'list' && <ListView />}
      </div>

      {/* Modal será implementado después */}
    </div>
  );
};

export default AuditoriasListing;
