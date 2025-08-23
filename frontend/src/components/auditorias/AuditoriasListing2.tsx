import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Auditoria,
    AuditoriaCardProps,
    AuditoriaEstado,
    AuditoriaViewMode,
    EstadoConfig
} from '@/types/auditorias';
import {
    BarChart3,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    Grid3X3,
    List,
    Plus,
    Search,
    Target,
    Trash2,
    User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditoriasService } from '../../services/auditoriasService.js';
import { useToast } from '../ui/use-toast';
import AuditoriaKanbanBoard from './AuditoriaKanbanBoard.jsx';

// ===============================================
// COMPONENTE DE LISTADO DE AUDITORÍAS v2 - SGC PRO
// ===============================================

const AuditoriasListing2: React.FC = () => {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<AuditoriaViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados de auditoría con configuraciones de colores
  const estadoConfigs: Record<AuditoriaEstado, EstadoConfig> = {
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

  const loadAuditorias = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [AuditoriasListing2] Cargando auditorías...');
      
      const data = await auditoriasService.getAllAuditorias();
      console.log('📊 [AuditoriasListing2] Datos recibidos:', data);
      
      if (Array.isArray(data)) {
        setAuditorias(data);
        console.log(`✅ [AuditoriasListing2] ${data.length} auditorías cargadas exitosamente`);
      } else {
        console.warn('⚠️ [AuditoriasListing2] Los datos no son un array:', data);
        setAuditorias([]);
      }
      
    } catch (err) {
      console.error('❌ [AuditoriasListing2] Error cargando auditorías:', err);
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

  // Filtrar auditorías por búsqueda
  const filteredAuditorias = auditorias.filter((auditoria: Auditoria) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      auditoria.codigo?.toLowerCase().includes(searchLower) ||
      auditoria.titulo?.toLowerCase().includes(searchLower) ||
      auditoria.auditor_lider?.toLowerCase().includes(searchLower) ||
      auditoria.descripcion?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta auditoría?')) {
      try {
        await auditoriasService.deleteAuditoria(id);
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

  const handleEdit = (auditoria: Auditoria): void => {
    console.log('Editar auditoría:', auditoria);
    toast({
      title: "Función en desarrollo",
      description: "La edición de auditorías estará disponible pronto",
    });
  };

  const handleCreate = (): void => {
    console.log('Crear nueva auditoría');
    toast({
      title: "Función en desarrollo", 
      description: "La creación de auditorías estará disponible pronto",
    });
  };

  const handleAuditoriaStateChange = async (auditoriaId: number, newEstado: AuditoriaEstado): Promise<void> => {
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

  const handleCardClick = (auditoriaId: number): void => {
    console.log('🔗 Card clicked - navegando a auditoría:', auditoriaId);
    console.log('🧭 Navegando a ruta:', `/app/auditorias/${auditoriaId}`);
    navigate(`/app/auditorias/${auditoriaId}`);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Fecha no definida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const getEstadoConfig = (estado?: string): EstadoConfig => {
    if (!estado) {
      return {
        colorClasses: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Sin estado',
        bgColor: 'bg-gray-50'
      };
    }
    
    const estadoKey = estado.toLowerCase() as AuditoriaEstado;
    return estadoConfigs[estadoKey] || {
      colorClasses: 'bg-gray-100 text-gray-800 border-gray-200',
      label: estado,
      bgColor: 'bg-gray-50'
    };
  };

  const formatAreas = (areas?: string): string => {
    if (!areas) return 'Sin áreas definidas';
    if (typeof areas === 'string') return areas;
    if (Array.isArray(areas)) return areas.join(', ');
    return String(areas);
  };

  // Componente de tarjeta de auditoría
  const AuditoriaCard: React.FC<AuditoriaCardProps> = ({ auditoria, onClick, onEdit, onDelete, onStateChange }) => {
    const estadoConfig = getEstadoConfig(auditoria.estado);
    
    return (
      <Card 
        className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 h-full cursor-pointer hover:bg-gray-50"
        onClick={() => onClick(auditoria.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {auditoria.codigo || 'Sin código'}
              </CardTitle>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {auditoria.titulo || 'Sin título'}
              </p>
              <Badge 
                className={`text-xs font-medium px-2 py-1 ${estadoConfig.colorClasses}`}
              >
                {estadoConfig.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1">
          <div className="space-y-3">
            {/* Descripción */}
            {auditoria.descripcion && (
              <div className="text-sm text-gray-600 line-clamp-2">
                {auditoria.descripcion}
              </div>
            )}
            
            {/* Información del auditor */}
            {auditoria.auditor_lider && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-500" />
                <span>{auditoria.auditor_lider}</span>
              </div>
            )}
            
            {/* Fechas */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {auditoria.fecha_inicio && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Inicio: {formatDate(auditoria.fecha_inicio)}</span>
                </div>
              )}
              {auditoria.fecha_fin && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Fin: {formatDate(auditoria.fecha_fin)}</span>
                </div>
              )}
            </div>
            
            {/* Áreas auditadas */}
            {auditoria.areas_auditadas && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="line-clamp-1">{formatAreas(auditoria.areas_auditadas)}</span>
              </div>
            )}
            
            {/* Contadores de hallazgos */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {auditoria.hallazgos_count !== undefined && (
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>{auditoria.hallazgos_count} hallazgos</span>
                </div>
              )}
              {auditoria.no_conformidades_count !== undefined && (
                <div className="flex items-center space-x-1">
                  <span className="text-red-500">●</span>
                  <span>{auditoria.no_conformidades_count} NC</span>
                </div>
              )}
              {auditoria.observaciones_count !== undefined && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">●</span>
                  <span>{auditoria.observaciones_count} Obs</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center justify-end space-x-1 mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick(auditoria.id);
              }}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(auditoria);
              }}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(auditoria.id);
              }}
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
  const KanbanView: React.FC = () => (
    <AuditoriaKanbanBoard 
      auditorias={filteredAuditorias}
      onCardClick={handleCardClick}
      onAuditoriaStateChange={handleAuditoriaStateChange}
    />
  );

  // Vista Grid
  const GridView: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAuditorias.map((auditoria: Auditoria) => (
        <AuditoriaCard 
          key={auditoria.id} 
          auditoria={auditoria}
          onClick={handleCardClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStateChange={handleAuditoriaStateChange}
        />
      ))}
      
      {filteredAuditorias.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No se encontraron auditorías con ese criterio' : 'No hay auditorías registradas'}
          </p>
          {searchTerm && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600"
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // Vista Lista
  const ListView: React.FC = () => (
    <div className="space-y-4">
      {filteredAuditorias.map((auditoria: Auditoria) => (
        <Card 
          key={auditoria.id} 
          className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          onClick={() => handleCardClick(auditoria.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {auditoria.codigo || 'Sin código'}
                    </h3>
                    <Badge className={`${getEstadoConfig(auditoria.estado).colorClasses}`}>
                      {getEstadoConfig(auditoria.estado).label}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{auditoria.titulo}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{auditoria.descripcion}</p>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-700">
                  {auditoria.auditor_lider && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{auditoria.auditor_lider}</span>
                    </div>
                  )}
                  
                  {auditoria.fecha_inicio && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(auditoria.fecha_inicio)}</span>
                    </div>
                  )}
                  
                  {auditoria.areas_auditadas && (
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="max-w-xs truncate">{formatAreas(auditoria.areas_auditadas)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/auditorias/${auditoria.id}`);
                  }}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(auditoria);
                  }}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(auditoria.id);
                  }}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredAuditorias.length === 0 && !loading && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No se encontraron auditorías con ese criterio' : 'No hay auditorías registradas'}
          </p>
          {searchTerm && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600"
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Cargando auditorías...</div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={loadAuditorias} variant="outline">
            Intentar nuevamente
          </Button>
        </div>
      </div>
    );
  }

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
            {searchTerm && (
              <span>Filtradas: {filteredAuditorias.length}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar auditorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
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
    </div>
  );
};

export default AuditoriasListing2;
