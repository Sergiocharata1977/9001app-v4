import { Grid, Kanban, List, Plus, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DisenoDesarrolloKanbanBoard from '../../components/diseno-desarrollo/DisenoDesarrolloKanbanBoard';
import DisenoDesarrolloModal from '../../components/diseno-desarrollo/DisenoDesarrolloModal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import disenoDesarrolloService, { ProyectoDisenoDesarrollo } from '../../services/disenoDesarrolloService';

const DisenoDesarrolloPage: React.FC = () => {
    const [proyectos, setProyectos] = useState<ProyectoDisenoDesarrollo[]>([]);
    const [filteredProyectos, setFilteredProyectos] = useState<ProyectoDisenoDesarrollo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEtapa, setFilterEtapa] = useState('todos');
    const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'grid'>('kanban');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProyecto, setSelectedProyecto] = useState<ProyectoDisenoDesarrollo | null>(null);

    const etapas = [
        { value: 'todos', label: 'Todas las etapas' },
        { value: 'planificacion', label: 'Planificación' },
        { value: 'entradas', label: 'Entradas' },
        { value: 'diseno', label: 'Diseño' },
        { value: 'revision', label: 'Revisión' },
        { value: 'verificacion', label: 'Verificación' },
        { value: 'validacion', label: 'Validación' },
        { value: 'salidas', label: 'Salidas' },
        { value: 'control_cambios', label: 'Control de Cambios' }
    ];

    useEffect(() => {
        loadProyectos();
    }, []);

    useEffect(() => {
        filterProyectos();
    }, [proyectos, searchTerm, filterEtapa]);

    const loadProyectos = async () => {
        try {
            setLoading(true);
            const response = await disenoDesarrolloService.getProyectos();
            if (response.success) {
                setProyectos(response.data);
            } else {
                console.error('Error al cargar proyectos');
            }
        } catch (error) {
            console.error('Error cargando proyectos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProyectos = () => {
        let filtered = proyectos;
        if (searchTerm) {
            filtered = filtered.filter(proyecto =>
                proyecto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterEtapa !== 'todos') {
            filtered = filtered.filter(proyecto => proyecto.etapa_actual === filterEtapa);
        }
        setFilteredProyectos(filtered);
    };

    const handleProyectoStateChange = async (proyectoId: string, newEstado: string) => {
        try {
            await disenoDesarrolloService.updateProyecto(proyectoId, { etapa_actual: newEstado });
            setProyectos(prev => prev.map(p => 
                p.id === proyectoId ? { ...p, etapa_actual: newEstado } : p
            ));
        } catch (error) {
            console.error('Error actualizando estado:', error);
        }
    };

    const handleCardClick = (proyecto: ProyectoDisenoDesarrollo, action: 'view' | 'edit') => {
        if (action === 'edit') {
            setSelectedProyecto(proyecto);
            setIsModalOpen(true);
        }
    };

    const handleModalSuccess = () => {
        loadProyectos();
        setSelectedProyecto(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Cargando...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Diseño y Desarrollo de Productos</h1>
                    <p className="text-gray-600">ISO 9001:2015 - Sección 8.3</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-lg">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar proyectos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterEtapa} onValueChange={setFilterEtapa}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por etapa" />
                    </SelectTrigger>
                    <SelectContent>
                        {etapas.map((etapa) => (
                            <SelectItem key={etapa.value} value={etapa.value}>
                                {etapa.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Button variant={viewMode === 'kanban' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('kanban')}>
                        <Kanban className="w-4 h-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                        <List className="w-4 h-4" />
                    </Button>
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                        <Grid className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                {viewMode === 'kanban' ? (
                    <DisenoDesarrolloKanbanBoard
                        proyectos={filteredProyectos}
                        onCardClick={handleCardClick}
                        onProyectoStateChange={handleProyectoStateChange}
                    />
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        Vista {viewMode} en desarrollo...
                    </div>
                )}
            </div>

            <DisenoDesarrolloModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                proyecto={selectedProyecto}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default DisenoDesarrolloPage;
