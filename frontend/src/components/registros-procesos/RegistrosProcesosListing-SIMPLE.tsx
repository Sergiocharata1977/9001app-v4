import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ClipboardList, Edit, Eye, Grid3X3, List, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo simplificados
const plantillasEjemplo = [
  {
    id: '1',
    nombre: 'Registro de Auditoría Interna',
    descripcion: 'Plantilla para registrar auditorías internas del sistema de calidad',
    estados: [
      { id: '1', nombre: 'Programada', color: '#f59e0b' },
      { id: '2', nombre: 'En Progreso', color: '#3b82f6' },
      { id: '3', nombre: 'Completada', color: '#10b981' }
    ],
    campos: [
      { id: '1', nombre: 'Auditor', tipo: 'text', requerido: true },
      { id: '2', nombre: 'Fecha', tipo: 'date', requerido: true },
      { id: '3', nombre: 'Área', tipo: 'select', requerido: true }
    ],
    activa: true,
    fecha_creacion: new Date(),
    creado_por: 'admin'
  },
  {
    id: '2',
    nombre: 'Registro de No Conformidades',
    descripcion: 'Plantilla para gestionar no conformidades y acciones correctivas',
    estados: [
      { id: '1', nombre: 'Detectada', color: '#ef4444' },
      { id: '2', nombre: 'En Análisis', color: '#f59e0b' },
      { id: '3', nombre: 'Acción Implementada', color: '#3b82f6' },
      { id: '4', nombre: 'Verificada', color: '#10b981' }
    ],
    campos: [
      { id: '1', nombre: 'Descripción', tipo: 'textarea', requerido: true },
      { id: '2', nombre: 'Responsable', tipo: 'text', requerido: true },
      { id: '3', nombre: 'Fecha Límite', tipo: 'date', requerido: true }
    ],
    activa: true,
    fecha_creacion: new Date(),
    creado_por: 'admin'
  },
  {
    id: '3',
    nombre: 'Registro de Reuniones',
    descripcion: 'Plantilla para documentar reuniones de revisión por dirección',
    estados: [
      { id: '1', nombre: 'Programada', color: '#6b7280' },
      { id: '2', nombre: 'Realizada', color: '#10b981' },
      { id: '3', nombre: 'Minuta Enviada', color: '#3b82f6' }
    ],
    campos: [
      { id: '1', nombre: 'Tema', tipo: 'text', requerido: true },
      { id: '2', nombre: 'Participantes', tipo: 'textarea', requerido: true },
      { id: '3', nombre: 'Decisiones', tipo: 'textarea', requerido: false }
    ],
    activa: true,
    fecha_creacion: new Date(),
    creado_por: 'admin'
  }
];

const RegistrosProcesosListingSimple: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [plantillas, setPlantillas] = useState(plantillasEjemplo);

  const filteredPlantillas = plantillas.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plantilla.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPlantilla = () => {
    // Navegar a crear nueva plantilla
    navigate('/app/registros-procesos/nueva');
  };

  const handleEditPlantilla = (id: string) => {
    navigate(`/app/registros-procesos/${id}/editar`);
  };

  const handleViewPlantilla = (id: string) => {
    navigate(`/app/registros-procesos/${id}`);
  };

  const handleDeletePlantilla = (id: string) => {
    setPlantillas(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Registros de Procesos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gestiona plantillas de registros personalizables para tus procesos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {filteredPlantillas.length} Plantillas
              </Badge>
              <Badge variant="outline" className="text-sm text-green-600 border-green-300">
                Sistema Activo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de herramientas */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar plantillas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={handleNewPlantilla} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Plantilla</span>
            </Button>
          </div>
        </div>

        {/* Lista de plantillas */}
        {filteredPlantillas.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron plantillas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera plantilla de registro'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewPlantilla} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Crear Primera Plantilla</span>
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredPlantillas.map((plantilla) => (
              <Card key={plantilla.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {plantilla.nombre}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {plantilla.descripcion}
                      </p>
                    </div>
                    <Badge variant={plantilla.activa ? 'default' : 'secondary'}>
                      {plantilla.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Estados */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estados ({plantilla.estados.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {plantilla.estados.map((estado) => (
                        <div
                          key={estado.id}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: `${estado.color}20`, color: estado.color }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: estado.color }}
                          />
                          <span>{estado.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campos */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Campos ({plantilla.campos.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {plantilla.campos.slice(0, 3).map((campo) => (
                        <Badge key={campo.id} variant="outline" className="text-xs">
                          {campo.nombre}
                          {campo.requerido && <span className="text-red-500 ml-1">*</span>}
                        </Badge>
                      ))}
                      {plantilla.campos.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plantilla.campos.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500">
                      Creado por {plantilla.creado_por}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPlantilla(plantilla.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPlantilla(plantilla.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlantilla(plantilla.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrosProcesosListingSimple;
