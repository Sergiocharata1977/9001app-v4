import React from 'react';
import { StandardKanbanBoard, KanbanItem } from '@/components/common/StandardKanbanBoard';
import { PRODUCTOS_KANBAN_CONFIG } from '@/config/kanbanConfig';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'en_produccion' | 'descontinuado';
  tipo: 'producto' | 'servicio';
  categoria: string;
  responsable: string;
  fecha_creacion: string;
  fecha_revision: string;
  version: string;
  especificaciones: string;
  requisitos_calidad: string;
  proceso_aprobacion: string;
  documentos_asociados: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
}

interface ProductoKanbanBoardProps {
  productos: Producto[];
  onCardClick?: (producto: Producto) => void;
  onProductoStateChange?: (productoId: number, newEstado: string) => void;
}

// Componente de tarjeta personalizada para productos
const ProductoKanbanCard: React.FC<{ item: KanbanItem }> = ({ item }) => {
  const producto = item as unknown as Producto;
  
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'en_revision':
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'aprobado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'en_produccion':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'descontinuado':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return 'bg-gray-100 text-gray-700';
      case 'en_revision':
        return 'bg-yellow-100 text-yellow-700';
      case 'aprobado':
        return 'bg-green-100 text-green-700';
      case 'en_produccion':
        return 'bg-blue-100 text-blue-700';
      case 'descontinuado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2">
              {producto.nombre}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getEstadoIcon(producto.estado)}
              <Badge variant="outline" className={`text-xs ${getEstadoColor(producto.estado)}`}>
                {producto.estado.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 text-xs text-gray-600">
          {producto.codigo && (
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs bg-gray-100 px-1 rounded">
                {producto.codigo}
              </span>
            </div>
          )}
          {producto.descripcion && (
            <p className="line-clamp-2 text-gray-700">
              {producto.descripcion}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Badge variant={producto.tipo === 'producto' ? 'default' : 'secondary'} className="text-xs">
              {producto.tipo === 'producto' ? 'Producto' : 'Servicio'}
            </Badge>
            {producto.responsable && (
              <span className="text-xs text-gray-500 truncate">
                {producto.responsable}
              </span>
            )}
          </div>
          {producto.categoria && (
            <div className="text-xs text-gray-500">
              {producto.categoria}
            </div>
          )}
          {producto.version && (
            <div className="text-xs text-gray-400">
              v{producto.version}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductoKanbanBoard: React.FC<ProductoKanbanBoardProps> = ({
  productos,
  onCardClick,
  onProductoStateChange
}) => {
  // Convertir productos a formato KanbanItem
  const kanbanItems: KanbanItem[] = productos.map(producto => ({
    id: producto.id.toString(),
    title: producto.nombre,
    description: producto.descripcion,
    status: producto.estado,
    assignedTo: producto.responsable,
    dueDate: producto.fecha_revision,
    // Incluir todos los datos del producto para acceso en la tarjeta
    ...producto
  }));

  const handleStatusChange = (itemId: string, newStatus: string) => {
    if (onProductoStateChange) {
      onProductoStateChange(parseInt(itemId), newStatus);
    }
  };

  const handleCardClick = (item: KanbanItem) => {
    if (onCardClick) {
      onCardClick(item as unknown as Producto);
    }
  };

  return (
    <div className="w-full">
      <StandardKanbanBoard
        items={kanbanItems}
        columns={PRODUCTOS_KANBAN_CONFIG}
        onItemClick={handleCardClick}
        onStatusChange={handleStatusChange}
        renderItem={(item) => <ProductoKanbanCard item={item} />}
        className="p-4"
      />
    </div>
  );
};

export default ProductoKanbanBoard;
