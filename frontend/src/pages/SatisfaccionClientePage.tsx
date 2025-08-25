import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Plus,
  Eye,
  Download,
  RefreshCw,
  X
} from 'lucide-react';
import encuestasService from '@/services/encuestasService';
import ResultadosEncuesta from '@/components/encuestas/ResultadosEncuesta';

const SatisfaccionClientePage = () => {
  const { toast } = useToast();
  const [encuestas, setEncuestas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEncuestas: 0,
    respuestasPostVenta: 0,
    respuestasAnual: 0,
    satisfaccionPromedio: 0
  });
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);

  useEffect(() => {
    loadEncuestas();
  }, []);

  const loadEncuestas = async () => {
    try {
      setIsLoading(true);
      const data = await encuestasService.getAll();
      const encuestasFiltradas = data.filter(encuesta => 
        encuesta.tipo === 'post_venta' || encuesta.tipo === 'anual'
      );
      setEncuestas(encuestasFiltradas);
      
      // Calcular estadísticas básicas
      const postVenta = encuestasFiltradas.filter(e => e.tipo === 'post_venta');
      const anual = encuestasFiltradas.filter(e => e.tipo === 'anual');
      
      setStats({
        totalEncuestas: encuestasFiltradas.length,
        respuestasPostVenta: postVenta.reduce((sum, e) => sum + (e.numRespuestas || 0), 0),
        respuestasAnual: anual.reduce((sum, e) => sum + (e.numRespuestas || 0), 0),
        satisfaccionPromedio: 4.2 // Mock data - se calcularía de las respuestas reales
      });
    } catch (error) {
      toast({
        title: 'Error al cargar encuestas',
        description: 'No se pudieron cargar las encuestas de satisfacción',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const crearEncuestaPostVenta = async () => {
    try {
      const encuestaPostVenta = {
        titulo: 'Encuesta de Satisfacción Post Venta',
        descripcion: 'Evaluación de la satisfacción del cliente después de la compra',
        tipo: 'post_venta',
        estado: 'Activa',
        preguntas: JSON.stringify([
          {
            id: 1,
            texto: '¿Qué tan satisfecho está con el producto/servicio adquirido?',
            tipo: 'escala_numerica',
            opciones: []
          },
          {
            id: 2,
            texto: '¿Recomendaría nuestros productos/servicios a otros?',
            tipo: 'opcion_multiple',
            opciones: [
              { id: 1, texto: 'Definitivamente sí' },
              { id: 2, texto: 'Probablemente sí' },
              { id: 3, texto: 'No estoy seguro' },
              { id: 4, texto: 'Probablemente no' },
              { id: 5, texto: 'Definitivamente no' }
            ]
          },
          {
            id: 3,
            texto: '¿Cómo calificaría la atención recibida?',
            tipo: 'escala_numerica',
            opciones: []
          },
          {
            id: 4,
            texto: 'Comentarios adicionales:',
            tipo: 'texto',
            opciones: []
          }
        ])
      };

      await encuestasService.create(encuestaPostVenta);
      toast({
        title: 'Encuesta creada',
        description: 'Encuesta de satisfacción post venta creada exitosamente'
      });
      loadEncuestas();
    } catch (error) {
      toast({
        title: 'Error al crear encuesta',
        description: 'No se pudo crear la encuesta post venta',
        variant: 'destructive'
      });
    }
  };

  const crearEncuestaAnual = async () => {
    try {
      const encuestaAnual = {
        titulo: 'Encuesta Anual de Satisfacción del Cliente',
        descripcion: 'Evaluación anual integral de la satisfacción del cliente',
        tipo: 'anual',
        estado: 'Activa',
        preguntas: JSON.stringify([
          {
            id: 1,
            texto: '¿Qué tan satisfecho está con nuestra empresa en general?',
            tipo: 'escala_numerica',
            opciones: []
          },
          {
            id: 2,
            texto: '¿Cómo calificaría la calidad de nuestros productos/servicios?',
            tipo: 'escala_numerica',
            opciones: []
          },
          {
            id: 3,
            texto: '¿Cómo calificaría el servicio al cliente?',
            tipo: 'escala_numerica',
            opciones: []
          },
          {
            id: 4,
            texto: '¿Qué aspectos de nuestro servicio le gustaría que mejoremos?',
            tipo: 'texto',
            opciones: []
          },
          {
            id: 5,
            texto: '¿Continuará trabajando con nosotros el próximo año?',
            tipo: 'opcion_multiple',
            opciones: [
              { id: 1, texto: 'Definitivamente sí' },
              { id: 2, texto: 'Probablemente sí' },
              { id: 3, texto: 'No estoy seguro' },
              { id: 4, texto: 'Probablemente no' },
              { id: 5, texto: 'Definitivamente no' }
            ]
          }
        ])
      };

      await encuestasService.create(encuestaAnual);
      toast({
        title: 'Encuesta creada',
        description: 'Encuesta anual de satisfacción creada exitosamente'
      });
      loadEncuestas();
    } catch (error) {
      toast({
        title: 'Error al crear encuesta',
        description: 'No se pudo crear la encuesta anual',
        variant: 'destructive'
      });
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'post_venta':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Post Venta</Badge>;
      case 'anual':
        return <Badge variant="default" className="bg-green-100 text-green-800">Anual</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Activa</Badge>;
      case 'cerrada':
        return <Badge variant="destructive">Cerrada</Badge>;
      default:
        return <Badge variant="secondary">{estado || 'Desconocido'}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Satisfacción del Cliente</h1>
            <p className="text-gray-600 mt-2">Gestión de encuestas de satisfacción post venta y anual</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={loadEncuestas}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Encuestas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEncuestas}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Respuestas Post Venta</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.respuestasPostVenta}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Respuestas Anual</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.respuestasAnual}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfacción Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.satisfaccionPromedio}/5</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Encuesta Post Venta</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Crear encuesta de satisfacción después de la compra
                    </p>
                  </div>
                  <Button onClick={crearEncuestaPostVenta} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Encuesta Post Venta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2 border-dashed border-green-200 hover:border-green-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Encuesta Anual</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Crear encuesta anual de satisfacción del cliente
                    </p>
                  </div>
                  <Button onClick={crearEncuestaAnual} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Encuesta Anual
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Lista de Encuestas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Encuestas de Satisfacción
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : encuestas.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No hay encuestas</h3>
                  <p className="mt-2 text-gray-500">
                    Crea tu primera encuesta de satisfacción usando los botones de arriba
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {encuestas.map((encuesta) => (
                    <div
                      key={encuesta.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{encuesta.titulo}</h4>
                          <p className="text-sm text-gray-600">{encuesta.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getTipoBadge(encuesta.tipo)}
                        {getEstadoBadge(encuesta.estado)}
                                                 <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => setSelectedEncuesta(encuesta)}
                         >
                           <Eye className="h-4 w-4 mr-2" />
                           Ver
                         </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
                 </motion.div>
       </div>

       {/* Modal de Resultados */}
       <Dialog open={!!selectedEncuesta} onOpenChange={() => setSelectedEncuesta(null)}>
         <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle className="flex items-center justify-between">
               <span>Resultados de la Encuesta</span>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setSelectedEncuesta(null)}
               >
                 <X className="h-4 w-4" />
               </Button>
             </DialogTitle>
           </DialogHeader>
           {selectedEncuesta && (
             <ResultadosEncuesta encuestaId={selectedEncuesta.id} />
           )}
         </DialogContent>
       </Dialog>
     </div>
   );
 };

export default SatisfaccionClientePage;
