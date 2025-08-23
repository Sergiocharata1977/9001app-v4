import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

const ActividadesAgroListing = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setActividades([]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header con diseño azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Actividades</h1>
              <p className="text-blue-100">
                Gestión de actividades comerciales y técnicas
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Actividad
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades Agro</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No se encontraron actividades</p>
              <p className="text-sm text-muted-foreground">Aún no hay actividades registradas</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear primera actividad
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActividadesAgroListing;
