import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Shield,
  Search,
  Users,
  TrendingUp,
  FileText,
  Package,
  BookOpen,
  ShoppingCart,
  Factory,
  Store,
  Target,
  Heart,
  Settings,
  User,
  Building
} from 'lucide-react';

const MenuPiramidalISO = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Estructura de datos de la pirámide ISO 9001
  const procesosPiramide = {
    nivel1: [
      {
        id: 'direccion-planificacion',
        titulo: 'Dirección y Planificación por Liderazgo',
        descripcion: 'Política de calidad, objetivos estratégicos y planificación organizacional',
        icono: Crown,
        color: 'bg-emerald-600 hover:bg-emerald-700',
        ruta: '/app/planificacion-direccion',
        nivel: 'Nivel 1 - Liderazgo'
      }
    ],
    nivel2: [
      {
        id: 'auditorias-internas',
        titulo: 'Auditorías Internas',
        descripcion: 'Evaluación sistemática del SGC',
        icono: Shield,
        color: 'bg-teal-600 hover:bg-teal-700',
        ruta: '/app/auditorias',
        nivel: 'Nivel 2 - Control'
      },
      {
        id: 'hallazgos',
        titulo: 'Hallazgos',
        descripcion: 'No conformidades y oportunidades de mejora',
        icono: Search,
        color: 'bg-teal-600 hover:bg-teal-700',
        ruta: '/app/hallazgos',
        nivel: 'Nivel 2 - Control'
      },
      {
        id: 'satisfaccion-clientes',
        titulo: 'Satisfacción de Clientes',
        descripcion: 'Medición y seguimiento de la satisfacción',
        icono: Heart,
        color: 'bg-teal-600 hover:bg-teal-700',
        ruta: '/app/satisfaccion-clientes',
        nivel: 'Nivel 2 - Control'
      }
    ],
    nivel3: [
      {
        id: 'acciones-mejora',
        titulo: 'Acciones de Mejora',
        descripcion: 'Correctivas, preventivas y de mejora continua',
        icono: TrendingUp,
        color: 'bg-green-600 hover:bg-green-700',
        ruta: '/app/acciones',
        nivel: 'Nivel 3 - Mejora'
      }
    ],
    nivel4: [
      {
        id: 'rrhh',
        titulo: 'RRHH',
        descripcion: 'Gestión del personal y competencias',
        icono: Users,
        color: 'bg-blue-600 hover:bg-blue-700',
        ruta: '/app/personal',
        nivel: 'Nivel 4 - Soporte'
      },
      {
        id: 'documentacion',
        titulo: 'Documentación',
        descripcion: 'Control de documentos e información',
        icono: FileText,
        color: 'bg-blue-600 hover:bg-blue-700',
        ruta: '/app/documentos',
        nivel: 'Nivel 4 - Soporte'
      },
      {
        id: 'desarrollo-productos',
        titulo: 'Desarrollo de Productos y Servicios',
        descripcion: 'Diseño y desarrollo de productos/servicios',
        icono: Package,
        color: 'bg-blue-600 hover:bg-blue-700',
        ruta: '/app/productos',
        nivel: 'Nivel 4 - Soporte'
      },
      {
        id: 'puntos-norma',
        titulo: 'Puntos de la Norma',
        descripcion: 'Requisitos específicos ISO 9001',
        icono: BookOpen,
        color: 'bg-blue-600 hover:bg-blue-700',
        ruta: '/app/normas',
        nivel: 'Nivel 4 - Soporte'
      }
    ],
    nivel5: [
      {
        id: 'compra',
        titulo: 'Compra',
        descripcion: 'Gestión de proveedores y compras',
        icono: ShoppingCart,
        color: 'bg-purple-600 hover:bg-purple-700',
        ruta: '/app/compras',
        nivel: 'Nivel 5 - Operación'
      },
      {
        id: 'produccion',
        titulo: 'Producción/Suministro/Servicio',
        descripcion: 'Procesos operativos principales',
        icono: Factory,
        color: 'bg-purple-600 hover:bg-purple-700',
        ruta: '/app/produccion',
        nivel: 'Nivel 5 - Operación'
      },
      {
        id: 'venta',
        titulo: 'Venta',
        descripcion: 'Comercialización y atención al cliente',
        icono: Store,
        color: 'bg-purple-600 hover:bg-purple-700',
        ruta: '/app/ventas',
        nivel: 'Nivel 5 - Operación'
      }
    ]
  };

  const handleCardClick = (proceso) => {
    navigate(proceso.ruta);
  };

  const ProcesoCard = ({ proceso, index, totalInLevel }) => {
    const IconComponent = proceso.icono;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="relative"
      >
        <Card 
          className={`
            cursor-pointer transition-all duration-300 border-2 border-white/20
            backdrop-blur-sm shadow-lg hover:shadow-2xl
            ${hoveredCard === proceso.id ? 'ring-2 ring-white/40' : ''}
          `}
          onMouseEnter={() => setHoveredCard(proceso.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick(proceso)}
        >
          <CardContent className={`p-6 text-center text-white ${proceso.color} rounded-lg`}>
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/20 rounded-full">
                <IconComponent className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight">
                  {proceso.titulo}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {proceso.descripcion}
                </p>
              </div>
              
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {proceso.nivel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <Building className="w-12 h-12 text-emerald-600 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Procesos ISO 9001
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Estructura Piramidal del Sistema de Gestión de Calidad
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-gray-700">
          <p className="text-lg leading-relaxed">
            Explora la jerarquía de procesos de tu sistema de gestión de calidad. 
            Desde la dirección estratégica hasta las operaciones diarias, cada nivel 
            representa una capa fundamental para el cumplimiento de la norma ISO 9001:2015.
          </p>
        </div>
      </motion.div>

      {/* Pirámide de Procesos */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Nivel 1 - Liderazgo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md">
            {procesosPiramide.nivel1.map((proceso, index) => (
              <ProcesoCard 
                key={proceso.id} 
                proceso={proceso} 
                index={index}
                totalInLevel={procesosPiramide.nivel1.length}
              />
            ))}
          </div>
        </motion.div>

        {/* Nivel 2 - Control */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {procesosPiramide.nivel2.map((proceso, index) => (
            <ProcesoCard 
              key={proceso.id} 
              proceso={proceso} 
              index={index}
              totalInLevel={procesosPiramide.nivel2.length}
            />
          ))}
        </motion.div>

        {/* Nivel 3 - Mejora */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md">
            {procesosPiramide.nivel3.map((proceso, index) => (
              <ProcesoCard 
                key={proceso.id} 
                proceso={proceso} 
                index={index}
                totalInLevel={procesosPiramide.nivel3.length}
              />
            ))}
          </div>
        </motion.div>

        {/* Nivel 4 - Soporte */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {procesosPiramide.nivel4.map((proceso, index) => (
            <ProcesoCard 
              key={proceso.id} 
              proceso={proceso} 
              index={index}
              totalInLevel={procesosPiramide.nivel4.length}
            />
          ))}
        </motion.div>

        {/* Nivel 5 - Operación */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {procesosPiramide.nivel5.map((proceso, index) => (
            <ProcesoCard 
              key={proceso.id} 
              proceso={proceso} 
              index={index}
              totalInLevel={procesosPiramide.nivel5.length}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer informativo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <div className="font-semibold text-emerald-800">Nivel 1 - Liderazgo</div>
              <div className="text-emerald-600">Dirección estratégica</div>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <div className="font-semibold text-teal-800">Nivel 2 - Control</div>
              <div className="text-teal-600">Seguimiento y medición</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="font-semibold text-green-800">Nivel 3 - Mejora</div>
              <div className="text-green-600">Mejora continua</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="font-semibold text-blue-800">Nivel 4 - Soporte</div>
              <div className="text-blue-600">Recursos y apoyo</div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <div className="font-semibold text-purple-800">Nivel 5 - Operación</div>
              <div className="text-purple-600">Procesos operativos</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuPiramidalISO;
