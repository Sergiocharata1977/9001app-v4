import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Target, DollarSign, Calendar, User } from 'lucide-react';
import { crmService } from '@/services/crmService';

const OportunidadesPage = () => {
  const [oportunidades, setOportunidades] = useState([]);
  const [filteredOportunidades, setFilteredOportunidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState('all');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarOportunidades();
  }, [oportunidades, searchTerm, selectedEtapa]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.getOportunidades();
      setOportunidades(response.data || []);
    } catch (error) {
      console.error('Error cargando oportunidades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarOportunidades = () => {
    let filtered = [...oportunidades];

    if (searchTerm) {
      filtered = filtered.filter(oportunidad =>
        oportunidad.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oportunidad.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEtapa && selectedEtapa !== 'all') {
      filtered = filtered.filter(oportunidad => oportunidad.etapa === selectedEtapa);
    }

    setFilteredOportunidades(filtered);
  };

  const getEtapaColor = (etapa) => {
    const colors = {
      prospeccion: 'bg-gray-100 text-gray-800',
      calificacion: 'bg-blue-100 text-blue-800',
      propuesta: 'bg-yellow-100 text-yellow-800',
      negociacion: 'bg-orange-100 text-orange-800',
      cerrada_ganada: 'bg-green-100 text-green-800',
      cerrada_perdida: 'bg-red-100 text-red-800'
    };
    return colors[etapa] || 'bg-gray-100 text-gray-800';
  };

  const getEtapaLabel = (etapa) => {
    const labels = {
      prospeccion: 'Prospección',
      calificacion: 'Calificación',
      propuesta: 'Propuesta',
      negociacion: 'Negociación',
      cerrada_ganada: 'Cerrada (Ganada)',
      cerrada_perdida: 'Cerrada (Perdida)'
    };
    return labels[etapa] || etapa;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando oportunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-600">Pipeline de ventas y seguimiento de oportunidades</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Oportunidad
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Título, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Etapa</label>
              <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  <SelectItem value="prospeccion">Prospección</SelectItem>
                  <SelectItem value="calificacion">Calificación</SelectItem>
                  <SelectItem value="propuesta">Propuesta</SelectItem>
                  <SelectItem value="negociacion">Negociación</SelectItem>
                  <SelectItem value="cerrada_ganada">Cerrada (Ganada)</SelectItem>
                  <SelectItem value="cerrada_perdida">Cerrada (Perdida)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Oportunidades */}
      <Card>
        <CardHeader>
          <CardTitle>
            Oportunidades ({filteredOportunidades.length} de {oportunidades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOportunidades.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron oportunidades</h3>
              <p className="text-gray-600">Crea tu primera oportunidad para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOportunidades.map((oportunidad) => (
                <Card key={oportunidad.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {oportunidad.titulo}
                          </h3>
                          <Badge className={getEtapaColor(oportunidad.etapa)}>
                            {getEtapaLabel(oportunidad.etapa)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {oportunidad.descripcion || 'Sin descripción'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Cliente: {oportunidad.cliente_nombre || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Valor: ${oportunidad.valor_estimado?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Probabilidad: {oportunidad.probabilidad || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OportunidadesPage;
