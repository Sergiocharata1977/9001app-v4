import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Users, Mail, Phone, MapPin, Award, Building } from 'lucide-react';

const ClienteCard = ({ cliente, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'potencial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactivo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria?.toUpperCase()) {
      case 'A':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calcularCompletitud = (cliente) => {
    const campos = [
      'nombre', 'razon_social', 'rfc', 'email', 'telefono', 
      'direccion', 'ciudad', 'estado', 'codigo_postal', 'pais',
      'sitio_web', 'representante_legal', 'vendedor_asignado_id',
      'supervisor_comercial_id', 'zona_venta', 'especialidad_interes'
    ];
    
    const camposCompletados = campos.filter(campo => 
      cliente[campo] && cliente[campo].trim() !== ''
    ).length;
    
    return Math.round((camposCompletados / campos.length) * 100);
  };

  const completitud = calcularCompletitud(cliente);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Header con gradiente */}
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {cliente.nombre || 'Sin nombre'}
                </h3>
                <p className="text-white/80 text-sm">
                  {cliente.razon_social || 'Sin razón social'}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Badge variant="secondary" className={getStatusColor(cliente.tipo_cliente)}>
                {cliente.tipo_cliente || 'potencial'}
              </Badge>
              <Badge variant="secondary" className={getCategoriaColor(cliente.categoria)}>
                {cliente.categoria || 'C'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Información de contacto */}
          <div className="space-y-2">
            {cliente.email && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {cliente.email}
              </div>
            )}
            {cliente.telefono && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {cliente.telefono}
              </div>
            )}
            {(cliente.ciudad || cliente.estado) && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {cliente.ciudad && cliente.estado 
                  ? `${cliente.ciudad}, ${cliente.estado}`
                  : cliente.ciudad || cliente.estado
                }
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="space-y-2">
            {cliente.representante_legal && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Building className="w-4 h-4 mr-2 text-gray-400" />
                {cliente.representante_legal}
              </div>
            )}
            {cliente.zona_venta && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Award className="w-4 h-4 mr-2 text-gray-400" />
                {cliente.zona_venta}
              </div>
            )}
          </div>

          {/* Barra de completitud */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Completitud</span>
              <span>{completitud}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  completitud >= 80 ? 'bg-green-500' : 
                  completitud >= 60 ? 'bg-yellow-500' : 
                  completitud >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${completitud}%` }}
              ></div>
            </div>
          </div>

          {/* Observaciones */}
          {cliente.observaciones && (
            <div className="pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {cliente.observaciones}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(cliente)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(cliente)}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(cliente)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ClienteCard;
