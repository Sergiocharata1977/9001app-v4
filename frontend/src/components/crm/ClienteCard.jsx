import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { crmUtils } from '@/services/crmService';
import { TIPOS_CLIENTE, CATEGORIAS_CLIENTE } from '@/types/crm';

const ClienteCard = ({ 
  cliente, 
  onView, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = "" 
}) => {
  const tipoCliente = TIPOS_CLIENTE.find(t => t.value === cliente.tipo_cliente);
  const categoriaCliente = CATEGORIAS_CLIENTE.find(c => c.value === cliente.categoria);

  return (
    <Card className={`sgc-card hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {cliente.nombre}
            </CardTitle>
            {cliente.razon_social && (
              <p className="text-sm text-gray-600 mb-2">
                <Building className="w-3 h-3 inline mr-1" />
                {cliente.razon_social}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: crmUtils.getTipoClienteColor(cliente.tipo_cliente),
                  color: crmUtils.getTipoClienteColor(cliente.tipo_cliente)
                }}
              >
                {tipoCliente?.label || 'Sin tipo'}
              </Badge>
              {categoriaCliente && (
                <Badge variant="secondary" className="text-xs">
                  {categoriaCliente.label}
                </Badge>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onView?.(cliente)}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit?.(cliente)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete?.(cliente)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Información de contacto */}
          <div className="space-y-2">
            {cliente.telefono && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{cliente.telefono}</span>
              </div>
            )}
            
            {cliente.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{cliente.email}</span>
              </div>
            )}
            
            {cliente.ciudad && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{cliente.ciudad}</span>
              </div>
            )}
          </div>

          {/* Información comercial */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>Vendedor:</span>
              </div>
              <span className="font-medium">
                {cliente.vendedor_nombre || 'Sin asignar'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-1">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Registro:</span>
              </div>
              <span className="font-medium">
                {new Date(cliente.fecha_registro).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Métricas del cliente */}
          {cliente.oportunidades_count !== undefined && (
            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">
                    {cliente.oportunidades_count || 0}
                  </div>
                  <div className="text-gray-500 text-xs">Oportunidades</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {crmUtils.formatearMoneda(cliente.valor_total_oportunidades || 0)}
                  </div>
                  <div className="text-gray-500 text-xs">Valor Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteCard;
