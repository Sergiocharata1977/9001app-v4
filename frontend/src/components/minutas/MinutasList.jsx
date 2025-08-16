import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import MinutasModal from './MinutasModal';
import minutasService from '@/services/minutasService';

const MinutasList = () => {
  const [minutas, setMinutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMinuta, setSelectedMinuta] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMinutas = async () => {
      try {
        setLoading(true);
        const data = await minutasService.getAll();
        setMinutas(data);
        setError(null); // Limpiar errores previos si la carga es exitosa
      } catch (err) {
        const errorMessage = err.message || 'Error al cargar las minutas. Intente de nuevo más tarde.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMinutas();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // useEffect para mostrar el toast cuando el estado de error cambie
  useEffect(() => {
    if (error) {
      toast({
        title: "Error de Carga",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleDelete = async (id) => {
    try {
      await minutasService.delete(id);
      toast({ title: 'Éxito', description: 'Minuta eliminada' });
      const fetchMinutas = async () => {
        setLoading(true);
        try {
          const data = await minutasService.getAll();
          setMinutas(data);
        } catch (err) {
          setError(err.message || 'No se pudieron recargar las minutas.');
        } finally {
          setLoading(false);
        }
      };
      fetchMinutas();
    } catch (error) {
      setError(error.message || 'Error al eliminar la minuta.');
    }
  };

  const handleEdit = (minuta) => {
    setSelectedMinuta(minuta);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedMinuta(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    // Volver a cargar las minutas después de guardar
    const fetchMinutas = async () => {
      setLoading(true);
      try {
        const data = await minutasService.getAll();
        setMinutas(data);
      } catch (err) {
        setError(err.message || 'No se pudieron recargar las minutas.');
      } finally {
        setLoading(false);
      }
    };
    fetchMinutas();
    setModalOpen(false);
  };

  if (loading) return <div className="p-4">Cargando minutas...</div>;

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Minutas</h1>
        <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Minuta
        </Button>
      </div>

      {minutas.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500 mb-4">No hay minutas registradas</p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Crear primera minuta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {minutas.map((minuta) => (
            <Card key={minuta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{minuta.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{minuta.descripcion}</p>
                <div className="space-y-2 mb-4">
                  <Badge variant="outline" className="w-full justify-start">
                    Responsable: {minuta.organizador_nombre || minuta.responsable}
                  </Badge>
                  
                  {/* Contadores SGC */}
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      👥 {minuta.total_participantes || 0}
                    </div>
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded">
                      📎 {minuta.total_documentos || 0}
                    </div>
                    <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      📋 {minuta.total_normas || 0}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Tipo: {minuta.tipo || 'reunion'}</span>
                    <span>Estado: {minuta.estado || 'borrador'}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Creado: {new Date(minuta.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(minuta)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(minuta.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MinutasModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave}
        minuta={selectedMinuta}
      />
    </div>
  );
};

export default MinutasList;
