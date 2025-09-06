import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlertCircle,
    CheckSquare,
    Clock,
    Edit,
    Eye,
    Plus, Search
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { IPlantillaRegistro } from '../../types/editorRegistros';

interface VistaKanbanProps {
  plantilla: IPlantillaRegistro;
  onRegistroUpdate?: (registro: any) => void;
  onRegistroDelete?: (id: string) => void;
}

const VistaKanban: React.FC<VistaKanbanProps> = ({ 
  plantilla, 
  onRegistroUpdate, 
  onRegistroDelete 
}) => {
  const { toast } = useToast();
  const [registros, setRegistros] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Datos de ejemplo para registros
  const registrosEjemplo = [
    {
      id: '1',
      titulo: 'Auditoría Interna Q1 2024',
      estado_id: '1',
      estado_nombre: 'Programada',
      campos: {
        auditor: 'María González',
        fecha: '2024-01-15',
        area: 'Producción'
      },
      fecha_creacion: new Date(),
      creado_por: 'admin',
      observaciones: 'Auditoría programada para el primer trimestre'
    },
    {
      id: '2',
      titulo: 'Revisión de No Conformidad NC-001',
      estado_id: '2',
      estado_nombre: 'En Análisis',
      campos: {
        descripcion: 'Desviación en proceso de empaque',
        responsable: 'Carlos Ruiz',
        fecha_limite: '2024-01-20'
      },
      fecha_creacion: new Date(),
      creado_por: 'admin',
      observaciones: 'Requiere análisis de causa raíz'
    },
    {
      id: '3',
      titulo: 'Reunión de Revisión por Dirección',
      estado_id: '3',
      estado_nombre: 'Realizada',
      campos: {
        tema: 'Revisión del SGC',
        participantes: 'Dirección, Gerencia, Supervisores',
        decisiones: 'Implementar nuevas medidas de control'
      },
      fecha_creacion: new Date(),
      creado_por: 'admin',
      observaciones: 'Reunión exitosa con decisiones importantes'
    }
  ];

  useEffect(() => {
    // Simular carga de registros
    setIsLoading(true);
    setTimeout(() => {
      setRegistros(registrosEjemplo);
      setIsLoading(false);
    }, 1000);
  }, [plantilla]);

  const handleEstadoChange = (registroId: string, nuevoEstadoId: string) => {
    const nuevoEstado = plantilla.estados.find(e => e._id === nuevoEstadoId);
    if (!nuevoEstado) return;

    setRegistros(prev => prev.map(registro => 
      registro.id === registroId 
        ? { ...registro, estado_id: nuevoEstadoId, estado_nombre: nuevoEstado.nombre }
        : registro
    ));

    toast({
      title: 'Estado actualizado',
      description: `El registro se movió a ${nuevoEstado.nombre}`,
    });
  };

  const handleNuevoRegistro = () => {
    toast({
      title: 'Nuevo registro',
      description: 'Funcionalidad de nuevo registro en desarrollo',
    });
  };

  const filteredRegistros = registros.filter(registro => {
    const matchesSearch = registro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         Object.values(registro.campos).some(val => 
                           val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesEstado = filterEstado === 'all' || registro.estado_id === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const registrosPorEstado = plantilla.estados.map(estado => ({
    estado,
    registros: filteredRegistros.filter(registro => registro.estado_id === estado._id)
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {plantilla.estados.map(estado => (
                <SelectItem key={estado._id} value={estado._id}>
                  {estado.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleNuevoRegistro} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Registro</span>
        </Button>
      </div>

      {/* Vista Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {registrosPorEstado.map(({ estado, registros: registrosEstado }) => (
          <Card key={estado._id} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: estado.color }}
                  />
                  <span>{estado.nombre}</span>
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {registrosEstado.length}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {registrosEstado.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No hay registros en este estado
                </div>
              ) : (
                registrosEstado.map(registro => (
                  <div
                    key={registro.id}
                    className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        {registro.titulo}
                      </h4>
                      
                      <div className="space-y-1">
                        {Object.entries(registro.campos).map(([key, value]) => (
                          <div key={key} className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium capitalize">{key}:</span> {value}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-gray-500">
                          {format(registro.fecha_creacion, 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Total Registros</p>
                <p className="text-2xl font-bold">{registros.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">En Progreso</p>
                <p className="text-2xl font-bold">
                  {registros.filter(r => r.estado_nombre === 'En Progreso').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold">
                  {registros.filter(r => r.estado_nombre === 'Programada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VistaKanban;

