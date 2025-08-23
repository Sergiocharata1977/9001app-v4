import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Users, Mail, Phone, MapPin } from 'lucide-react';

const ClienteTableView = ({ clientes, onEdit, onDelete, onView }) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Representante</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {cliente.nombre || 'Sin nombre'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {cliente.razon_social || 'Sin razón social'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {cliente.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="w-3 h-3 mr-1 text-gray-400" />
                      {cliente.email}
                    </div>
                  )}
                  {cliente.telefono && (
                    <div className="flex items-center text-sm">
                      <Phone className="w-3 h-3 mr-1 text-gray-400" />
                      {cliente.telefono}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                  {cliente.ciudad && cliente.estado 
                    ? `${cliente.ciudad}, ${cliente.estado}`
                    : cliente.ciudad || cliente.estado || 'No especificada'
                  }
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(cliente.tipo_cliente)}>
                  {cliente.tipo_cliente || 'potencial'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getCategoriaColor(cliente.categoria)}>
                  {cliente.categoria || 'C'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {cliente.representante_legal || 'No asignado'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(cliente)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(cliente)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(cliente)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClienteTableView;
