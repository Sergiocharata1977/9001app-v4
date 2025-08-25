import { Action, Column, DataTable } from '@/components/shared/DataTable/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import productosService, { Producto } from '@/services/productosService';
import { AlertTriangle, CheckCircle, Edit, Eye, Eye as EyeIcon, FileText, Package, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductoKanbanBoard from './ProductoKanbanBoard';
import ProductoModal from './ProductoModal';

export function ProductosListingWithKanban() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Definir columnas para la tabla
  const columns: Column<Producto>[] = [
    {
      key: 'codigo',
      label: 'Código',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className="font-mono text-sm">{value || 'N/A'}</span>
      )
    },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          {row.descripcion && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {row.descripcion}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      width: '120px',
      render: (value) => (
        <Badge variant={value === 'producto' ? 'default' : 'secondary'}>
          {value === 'producto' ? 'Producto' : 'Servicio'}
        </Badge>
      )
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: true,
      filterable: true,
      width: '150px'
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      width: '140px',
      render: (value) => {
        const config = {
          borrador: { 
            variant: 'outline' as const, 
            icon: FileText, 
            label: 'Borrador',
            color: 'text-gray-600 bg-gray-50 border-gray-200'
          },
          en_revision: { 
            variant: 'outline' as const, 
            icon: EyeIcon, 
            label: 'En Revisión',
            color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
          },
          aprobado: { 
            variant: 'outline' as const, 
            icon: CheckCircle, 
            label: 'Aprobado',
            color: 'text-green-600 bg-green-50 border-green-200'
          },
          en_produccion: { 
            variant: 'outline' as const, 
            icon: Package, 
            label: 'En Producción',
            color: 'text-blue-600 bg-blue-50 border-blue-200'
          },
          descontinuado: { 
            variant: 'outline' as const, 
            icon: AlertTriangle, 
            label: 'Descontinuado',
            color: 'text-red-600 bg-red-50 border-red-200'
          }
        };
        const configItem = config[value as keyof typeof config] || config.borrador;
        return (
          <Badge variant={configItem.variant} className={configItem.color}>
            {configItem.label}
          </Badge>
        );
      }
    },
    {
      key: 'responsable',
      label: 'Responsable',
      sortable: true,
      width: '150px'
    },
    {
      key: 'version',
      label: 'Versión',
      sortable: true,
      width: '80px',
      render: (value) => (
        <span className="font-mono text-sm">v{value || '1.0'}</span>
      )
    },
    {
      key: 'fecha_creacion',
      label: 'Fecha Creación',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

  // Acciones de la tabla
  const actions: Action<Producto>[] = [
    {
      icon: Eye,
      label: 'Ver',
      onClick: (row) => handleView(row),
      variant: 'ghost' as const
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: (row) => handleEdit(row),
      variant: 'ghost' as const
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: (row) => handleDelete(row),
      variant: 'ghost' as const,
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  // Cargar datos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await productosService.getAll();
      setProductos(response || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Manejadores de eventos
  const handleCreate = () => {
    setSelectedProducto(null);
    setModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalOpen(true);
  };

  const handleView = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      try {
        await productosService.delete(producto.id);
        toast.success('Producto eliminado correctamente');
        fetchProductos();
      } catch (err: any) {
        toast.error(err.message || 'Error al eliminar el producto');
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProducto(null);
  };

  const handleModalSave = async (data: any) => {
    try {
      if (selectedProducto) {
        await productosService.update(selectedProducto.id, data);
        toast.success('Producto actualizado correctamente');
      } else {
        await productosService.create(data);
        toast.success('Producto creado correctamente');
      }
      handleModalClose();
      fetchProductos();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el producto');
    }
  };

  const handleProductoStateChange = async (productoId: number, newEstado: string) => {
    try {
      await productosService.updateEstado(productoId, newEstado);
      toast.success('Estado actualizado correctamente');
      fetchProductos();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar el estado');
    }
  };

  // Estadísticas
  const estadisticas = {
    total: productos.length,
    productos: productos.filter(p => p.tipo === 'producto').length,
    servicios: productos.filter(p => p.tipo === 'servicio').length,
    enProduccion: productos.filter(p => p.estado === 'en_produccion').length,
    aprobados: productos.filter(p => p.estado === 'aprobado').length,
    enRevision: productos.filter(p => p.estado === 'en_revision').length,
    borradores: productos.filter(p => p.estado === 'borrador').length,
    descontinuados: productos.filter(p => p.estado === 'descontinuado').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={fetchProductos}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos y Servicios</h1>
          <p className="text-gray-600">Diseño, control y seguimiento de productos y servicios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tabla
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </Button>
          <Button onClick={handleCreate}>
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.productos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{estadisticas.servicios}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Producción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estadisticas.enProduccion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aprobados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estadisticas.aprobados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Revisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.enRevision}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Borradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{estadisticas.borradores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Descontinuados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estadisticas.descontinuados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido */}
      {viewMode === 'table' ? (
        <DataTable
          data={productos}
          columns={columns}
          actions={actions}
          searchable
          pagination
          onRefresh={fetchProductos}
          emptyMessage="No se encontraron productos. Haz clic en 'Nuevo Producto' para comenzar."
        />
      ) : (
        <ProductoKanbanBoard
          productos={productos}
          onCardClick={handleView}
          onProductoStateChange={handleProductoStateChange}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <ProductoModal
          producto={selectedProducto}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default ProductosListingWithKanban;
