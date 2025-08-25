import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Download,
  Calendar,
  CheckCircle
} from 'lucide-react';
import encuestasService from '@/services/encuestasService';

const ResultadosEncuesta = ({ encuestaId }) => {
  const { toast } = useToast();
  const [encuesta, setEncuesta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRespuestas: 0,
    satisfaccionPromedio: 0,
    recomendacionPromedio: 0,
    satisfaccionPorPregunta: {}
  });

  useEffect(() => {
    if (encuestaId) {
      loadResultados();
    }
  }, [encuestaId]);

  const loadResultados = async () => {
    try {
      setIsLoading(true);
      
      // Cargar encuesta
      const encuestaData = await encuestasService.getById(encuestaId);
      if (encuestaData.preguntas && typeof encuestaData.preguntas === 'string') {
        encuestaData.preguntas = JSON.parse(encuestaData.preguntas);
      }
      setEncuesta(encuestaData);

      // Mock data para respuestas (en producción esto vendría del backend)
      const mockRespuestas = generateMockRespuestas(encuestaData);
      setRespuestas(mockRespuestas);

      // Calcular estadísticas
      calcularEstadisticas(mockRespuestas, encuestaData.preguntas);
    } catch (error) {
      toast({
        title: 'Error al cargar resultados',
        description: 'No se pudieron cargar los resultados de la encuesta',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockRespuestas = (encuesta) => {
    const respuestas = [];
    const numRespuestas = Math.floor(Math.random() * 50) + 10; // 10-60 respuestas

    for (let i = 0; i < numRespuestas; i++) {
      const respuesta = {
        id: i + 1,
        fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        respuestas: {}
      };

      encuesta.preguntas.forEach(pregunta => {
        switch (pregunta.tipo) {
          case 'escala_numerica':
            respuesta.respuestas[pregunta.id] = Math.floor(Math.random() * 5) + 1;
            break;
          case 'opcion_multiple':
            const opciones = pregunta.opciones || [];
            if (opciones.length > 0) {
              const randomIndex = Math.floor(Math.random() * opciones.length);
              respuesta.respuestas[pregunta.id] = opciones[randomIndex].texto;
            }
            break;
          case 'texto':
            respuesta.respuestas[pregunta.id] = `Comentario de prueba ${i + 1}`;
            break;
        }
      });

      respuestas.push(respuesta);
    }

    return respuestas;
  };

  const calcularEstadisticas = (respuestas, preguntas) => {
    const totalRespuestas = respuestas.length;
    let satisfaccionTotal = 0;
    let recomendacionTotal = 0;
    const satisfaccionPorPregunta = {};

    preguntas.forEach(pregunta => {
      if (pregunta.tipo === 'escala_numerica') {
        const valores = respuestas
          .map(r => r.respuestas[pregunta.id])
          .filter(v => v !== undefined);
        
        if (valores.length > 0) {
          const promedio = valores.reduce((sum, val) => sum + val, 0) / valores.length;
          satisfaccionPorPregunta[pregunta.id] = promedio;
          
          // Asumir que la primera pregunta es satisfacción general
          if (pregunta.id === 1) {
            satisfaccionTotal = promedio;
          }
          // Asumir que la segunda pregunta es sobre recomendación
          if (pregunta.id === 2) {
            recomendacionTotal = promedio;
          }
        }
      }
    });

    setStats({
      totalRespuestas,
      satisfaccionPromedio: satisfaccionTotal,
      recomendacionPromedio: recomendacionTotal,
      satisfaccionPorPregunta
    });
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

  const renderGraficoSatisfaccion = () => {
    const porcentaje = (stats.satisfaccionPromedio / 5) * 100;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Satisfacción General</span>
          <span className="text-lg font-bold text-gray-900">{stats.satisfaccionPromedio.toFixed(1)}/5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    );
  };

  const renderComentarios = () => {
    const comentarios = respuestas
      .filter(r => Object.values(r.respuestas).some(v => typeof v === 'string' && v.includes('Comentario')))
      .slice(0, 5); // Mostrar solo los primeros 5

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Comentarios Recientes</h4>
        {comentarios.map((respuesta, index) => (
          <div key={respuesta.id} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              "{Object.values(respuesta.respuestas).find(v => typeof v === 'string' && v.includes('Comentario'))}"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(respuesta.fecha).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!encuesta) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontró la encuesta</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{encuesta.titulo}</h2>
          <p className="text-gray-600 mt-1">{encuesta.descripcion}</p>
        </div>
        <div className="flex items-center space-x-3">
          {getTipoBadge(encuesta.tipo)}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Respuestas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRespuestas}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfacción Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.satisfaccionPromedio.toFixed(1)}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recomendación</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recomendacionPromedio.toFixed(1)}/5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Satisfacción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Análisis de Satisfacción
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderGraficoSatisfaccion()}
        </CardContent>
      </Card>

      {/* Comentarios */}
      <Card>
        <CardHeader>
          <CardTitle>Comentarios de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {renderComentarios()}
        </CardContent>
      </Card>

      {/* Resumen de Preguntas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {encuesta.preguntas.map((pregunta) => (
              <div key={pregunta.id} className="border-b pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-2">{pregunta.texto}</h4>
                {pregunta.tipo === 'escala_numerica' && stats.satisfaccionPorPregunta[pregunta.id] && (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Promedio:</span>
                    <span className="font-semibold text-gray-900">
                      {stats.satisfaccionPorPregunta[pregunta.id].toFixed(1)}/5
                    </span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= stats.satisfaccionPorPregunta[pregunta.id]
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultadosEncuesta;
