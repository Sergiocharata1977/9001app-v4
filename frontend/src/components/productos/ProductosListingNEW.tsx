import React, { useState, useEffect } from 'react';
import { DataTable, Column, Action, KanbanColumn } from '@/components/shared/DataTable/DataTable';
import { productosService } from '@/services/productosService';
import { toast } from 'sonner';
import { Edit, Trash2, Eye, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import ProductoModal from './ProductoModal';

// Tipo para Producto (compatible con tu estructura actual)
interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: 'activo' | 'inactivo' | 'desarrollo';
  tipo: 'producto' | 'servicio';
  categoria: string;
  responsable: string;
  fecha_creacion: string;
  fecha_revision: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export function ProductosListingNEW() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  // Definir columnas
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
      width: '120px',
      render: (value) => {
        const config = {
          activo: { variant: 'default' as const, icon: CheckCircle, label: 'Activo' },
          inactivo: { variant: 'secondary' as const, icon: XCircle, label: 'Inactivo' },
          desarrollo: { variant: 'outline' as const, icon: FileText, label: 'Desarrollo' }
        };
        
        const { variant, icon: Icon, label } = config[value as keyof typeof config] || config.inactivo;
        
        return (
          <Badge variant={variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
        );
      }
    },
    {
      key: 'responsable',
      label: 'Responsable',
      sortable: true,
      filterable: true,
      width: '150px'
    },
    {
      key: 'version',
      label: 'Versión',
      width: '80px',
      align: 'center',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value || '1.0'}</span>
      )
    },
    {
      key: 'fecha_revision',
      label: 'Última Revisión',
      sortable: true,
      width: '120px',
      render: (value) => {
        if (!value) return <span className="text-muted-foreground">-</span>;
        return new Date(value).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    }
  ];

  // Definir columnas Kanban
  const kanbanColumns: KanbanColumn<Producto>[] = [
    {
      key: 'activo',
      label: 'Activos',
      color: 'bg-green-600',
      filter: (producto) => producto.estado === 'activo'
    },
    {
      key: 'desarrollo',
      label: 'En Desarrollo',
      color: 'bg-blue-600',
      filter: (producto) => producto.estado === 'desarrollo'
    },
    {
      key: 'inactivo',
      label: 'Inactivos',
      color: 'bg-gray-600',
      filter: (producto) => producto.estado === 'inactivo'
    }
  ];

  // Definir acciones
  const actions: Action<Producto>[] = [
    {
      icon: Eye,
      label: 'Ver detalles',
      onClick: (row) => navigate(`/productos/${row.id}`),
      variant: 'ghost'
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: (row) => {
        setSelectedProducto(row);
        setModalOpen(true);
      },
      variant: 'ghost'
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: async (row) => {
        if (confirm(`¿Estás seguro de eliminar el producto "${row.nombre}"?`)) {
          try {
            await productosService.delete(row.id);
            toast.success('Producto eliminado correctamente');
            fetchProductos();
          } catch (error) {
            toast.error('Error al eliminar el producto');
          }
        }
      },
      variant: 'ghost',
      show: (row) => row.estado !== 'activo' // Solo mostrar si no está activo
    }
  ];

  // Cargar datos
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productosService.getAll();
      setProductos(response.data || []);
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

  // Manejar creación/edición
  const handleSave = async (data: any) => {
    try {
      if (selectedProducto) {
        await productosService.update(selectedProducto.id, data);
        toast.success('Producto actualizado correctamente');
      } else {
        await productosService.create(data);
        toast.success('Producto creado correctamente');
      }
      setModalOpen(false);
      setSelectedProducto(null);
      fetchProductos();
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  // Exportar datos
  const handleExport = (data: Producto[]) => {
    // Personalizar exportación si es necesario
    console.log('Exportando productos:', data);
    toast.success(`Exportando ${data.length} productos`);
  };

  // Manejar selección
  const handleSelectionChange = (selected: Producto[]) => {
    console.log('Productos seleccionados:', selected);
    // Aquí puedes agregar acciones masivas
  };

  // Manejar clic en tarjeta
  const handleCardClick = (producto: Producto) => {
    navigate(`/productos/${producto.id}`);
  };

  return (
    <>
      <DataTable
        data={productos}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={fetchProductos}
        onCreate={() => {
          setSelectedProducto(null);
          setModalOpen(true);
        }}
        searchable
        searchPlaceholder="Buscar por nombre, código o categoría..."
        searchFields={['nombre', 'codigo', 'categoria', 'responsable']}
        paginated
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        selectable
        onSelectionChange={handleSelectionChange}
        exportable
        onExport={handleExport}
        title="Gestión de Productos y Servicios"
        description="Administra el catálogo de productos y servicios de tu organización"
        emptyMessage="No hay productos registrados. Haz clic en 'Nuevo' para agregar uno."
        striped
        className="shadow-sm"
        // Configuración de vistas múltiples
        viewModes={['list', 'grid', 'kanban']}
        defaultView="list"
        kanbanColumns={kanbanColumns}
        gridColumns={3}
        onCardClick={handleCardClick}
      />

      {/* Modal de creación/edición */}
      {modalOpen && (
        <ProductoModal
          isOpen={modalOpen}
          producto={selectedProducto}
          onClose={() => {
            setModalOpen(false);
            setSelectedProducto(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default ProductosListingNEW;

