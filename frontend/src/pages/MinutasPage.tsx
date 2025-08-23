import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Calendar,
  Users,
  FileText,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MinutaTipo, MinutaEstado } from '@/types/minutas';


// Tipos para minutas
interface Minuta {
  id: string;
  titulo: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  tipo: 'reunion' | 'auditoria' | 'revision' | 'capacitacion';
  organizador_id: string;
  organizador?: {
    id: string;
    nombre_completo: string;
    email: string;
  };
  participantes: Array<{
    id: string;
    nombre_completo: string;
    rol: string;
    asistio: boolean;
  }>;
  agenda: string;
  conclusiones: string;
  acuerdos: string[];
  proxima_reunion?: string;
  estado: 'programada' | 'en_proceso' | 'completada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

interface MinutaFiltros {
  search?: string;
  tipo?: 'reunion' | 'auditoria' | 'revision' | 'capacitacion';
  estado?: 'programada' | 'en_proceso' | 'completada' | 'cancelada';
  fecha_desde?: string;
  fecha_hasta?: string;
  organizador_id?: string;
}

interface MinutasPageProps {
  // Props específicas si las hay
}

const MinutasPage: React.FC<MinutasPageProps> = () => {
  const [minutas, setMinutas] = useState<Minuta[]>([]);
  const [filtros, setFiltros] = useState<MinutaFiltros>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarMinutas();
  }, [filtros]);

  const cargarMinutas = async (): Promise<void> => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a API real
      // const response = await fetch('/api/minutas', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Datos de ejemplo
      const mockMinutas: Minuta[] = [
        {
          id: '1',
          titulo: 'Revisión de Indicadores de Calidad',
          fecha: '2024-01-15',
          hora_inicio: '09:00',
          hora_fin: '11:00',
          lugar: 'Sala de Juntas Principal',
          tipo: 'revision',
          organizador_id: '1',
          organizador: {
            id: '1',
            nombre_completo: 'Juan Pérez',
            email: 'juan.perez@empresa.com'
          },
          participantes: [
            {
              id: '1',
              nombre_completo: 'Juan Pérez',
              rol: 'organizador',
              asistio: true
            },
            {
              id: '2',
              nombre_completo: 'María García',
              rol: 'participante',
              asistio: true
            }
          ],
          agenda: 'Revisión de indicadores del mes anterior, análisis de tendencias, definición de acciones correctivas',
          conclusiones: 'Se identificaron 3 áreas de mejora y se asignaron responsables',
          acuerdos: [
            'Implementar nuevo indicador de satisfacción del cliente',
            'Revisar proceso de capacitación',
            'Actualizar documentación de procedimientos'
          ],
          estado: 'completada',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-15T11:00:00Z'
        },
        {
          id: '2',
          titulo: 'Auditoría Interna - Departamento de Producción',
          fecha: '2024-01-20',
          hora_inicio: '14:00',
          hora_fin: '16:00',
          lugar: 'Área de Producción',
          tipo: 'auditoria',
          organizador_id: '2',
          organizador: {
            id: '2',
            nombre_completo: 'Ana López',
            email: 'ana.lopez@empresa.com'
          },
          participantes: [
            {
              id: '2',
              nombre_completo: 'Ana López',
              rol: 'auditor',
              asistio: true
            },
            {
              id: '3',
              nombre_completo: 'Carlos Rodríguez',
              rol: 'auditado',
              asistio: true
            }
          ],
          agenda: 'Auditoría del proceso de producción según ISO 9001:2015',
          conclusiones: 'Proceso conforme con requisitos, se identificaron 2 oportunidades de mejora menores',
          acuerdos: [
            'Actualizar procedimiento de control de calidad',
            'Mejorar registro de no conformidades'
          ],
          estado: 'programada',
          created_at: '2024-01-12T15:00:00Z',
          updated_at: '2024-01-12T15:00:00Z'
        }
      ];
      
      setMinutas(mockMinutas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar minutas');
    } finally {
      setLoading(false);
    }
  };

  const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerColorTipo = (tipo: string): string => {
    switch (tipo) {
      case 'reunion': return 'bg-purple-100 text-purple-800';
      case 'auditoria': return 'bg-orange-100 text-orange-800';
      case 'revision': return 'bg-blue-100 text-blue-800';
      case 'capacitacion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerIconoTipo = (tipo: string): React.ReactNode => {
    switch (tipo) {
      case 'reunion': return <Users className="w-4 h-4" />;
      case 'auditoria': return <CheckCircle className="w-4 h-4" />;
      case 'revision': return <FileText className="w-4 h-4" />;
      case 'capacitacion': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-red-800 font-medium">Error</h3>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Minutas SGC</h1>
          <p className="text-gray-600 mt-1">Sistema de Gestión de Calidad - Minutas y Reuniones</p>
        </div>
        <Button 
          onClick={() => setShowModalCrear(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Minuta
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input
                placeholder="Buscar minutas..."
                value={filtros.search || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiltros({ ...filtros, search: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <Select 
                value={filtros.tipo || ''} 
                onValueChange={(value: string) => setFiltros({ ...filtros, tipo: value as MinutaTipo })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="reunion">Reunión</SelectItem>
                  <SelectItem value="auditoria">Auditoría</SelectItem>
                  <SelectItem value="revision">Revisión</SelectItem>
                  <SelectItem value="capacitacion">Capacitación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select 
                value={filtros.estado || ''} 
                onValueChange={(value: string) => setFiltros({ ...filtros, estado: value as MinutaEstado })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="programada">Programada</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filtros.fecha_desde || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Minutas */}
      <Card>
        <CardHeader>
          <CardTitle>Minutas SGC</CardTitle>
        </CardHeader>
        <CardContent>
          {minutas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay minutas</h3>
              <p className="text-gray-600 mb-4">Comienza creando tu primera minuta SGC</p>
              <Button onClick={() => setShowModalCrear(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Minuta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {minutas.map((minuta) => (
                <div 
                  key={minuta.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setMinutaSeleccionada(minuta);
                    setShowModalDetalle(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {obtenerIconoTipo(minuta.tipo)}
                      <div>
                        <h3 className="font-medium text-gray-900">{minuta.titulo}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatearFecha(minuta.fecha)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {minuta.hora_inicio} - {minuta.hora_fin}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {minuta.lugar}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={obtenerColorTipo(minuta.tipo)}>
                        {minuta.tipo}
                      </Badge>
                      <Badge className={obtenerColorEstado(minuta.estado)}>
                        {minuta.estado}
                      </Badge>
                    </div>
                  </div>
                  
                  {minuta.agenda && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {minuta.agenda}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{minuta.participantes.length} participantes</span>
                      <span>•</span>
                      <span>Organizada por: {minuta.organizador?.nombre_completo}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setMinutaSeleccionada(minuta);
                          setShowModalEditar(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setMinutaSeleccionada(minuta);
                          setShowModalDetalle(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Implementar modales para crear, editar y ver detalles */}
    </div>
  );
};

export default MinutasPage;
