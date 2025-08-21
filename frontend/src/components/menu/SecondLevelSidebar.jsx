import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Building,
    ChevronDown,
    ChevronRight,
    FileText,
    Heart,
    Package,
    RefreshCw,
    Search,
    Star,
    Target,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SecondLevelSidebar = ({ moduleType, onBackToMainMenu }) => {
    const [expandedSections, setExpandedSections] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Configuración de módulos de segundo nivel
    const moduleConfigs = {
        calidad: {
            title: 'Calidad',
            icon: Target,
            color: 'emerald',
            sections: [
                {
                    id: 'planificacion',
                    title: 'Planificación',
                    icon: Target,
                    items: [
                        { name: 'Planificación Estratégica', path: '/app/planificacion-estrategica' },
                        { name: 'Objetivos y Metas', path: '/app/objetivos-metas' },
                        { name: 'Revisión por Dirección', path: '/app/revision-direccion' }
                    ]
                },
                {
                    id: 'documentacion',
                    title: 'Documentación',
                    icon: FileText,
                    items: [
                        { name: 'Normas', path: '/app/normas' },
                        { name: 'Documentos', path: '/app/documentos' },
                        { name: 'Política de Calidad', path: '/app/politica-calidad' }
                    ]
                },
                {
                    id: 'auditorias',
                    title: 'Auditorías',
                    icon: Target,
                    items: [
                        { name: 'Auditorías', path: '/app/auditorias' },
                        { name: 'Hallazgos', path: '/app/hallazgos' },
                        { name: 'Acciones', path: '/app/acciones' }
                    ]
                },
                {
                    id: 'productos',
                    title: 'Productos',
                    icon: Package,
                    items: [
                        { name: 'Productos', path: '/app/productos' },
                        { name: 'Servicios', path: '/app/servicios' }
                    ]
                }
            ]
        },
        rrhh: {
            title: 'Recursos Humanos',
            icon: Users,
            color: 'blue',
            sections: [
                {
                    id: 'organizacion',
                    title: 'Organización',
                    icon: Building,
                    items: [
                        { name: 'Departamentos', path: '/app/departamentos' },
                        { name: 'Puestos', path: '/app/puestos' },
                        { name: 'Personal', path: '/app/personal' }
                    ]
                },
                {
                    id: 'desarrollo',
                    title: 'Desarrollo',
                    icon: Users,
                    items: [
                        { name: 'Capacitaciones', path: '/app/capacitaciones' },
                        { name: 'Evaluaciones', path: '/app/evaluaciones-individuales' },
                        { name: 'Competencias', path: '/app/competencias' }
                    ]
                }
            ]
        },
        procesos: {
            title: 'Procesos',
            icon: RefreshCw,
            color: 'purple',
            sections: [
                {
                    id: 'gestion',
                    title: 'Gestión',
                    icon: RefreshCw,
                    items: [
                        { name: 'Procesos', path: '/app/procesos' },
                        { name: 'Mejoras', path: '/app/mejoras' },
                        { name: 'Indicadores', path: '/app/indicadores' }
                    ]
                },
                {
                    id: 'productos',
                    title: 'Productos',
                    icon: Package,
                    items: [
                        { name: 'Productos', path: '/app/productos' },
                        { name: 'Servicios', path: '/app/servicios' }
                    ]
                }
            ]
        },
        'crm-satisfaccion': {
            title: 'CRM y Satisfacción',
            icon: Heart,
            color: 'indigo',
            sections: [
                {
                    id: 'clientes',
                    title: 'Clientes',
                    icon: Users,
                    items: [
                        { name: 'Clientes', path: '/app/crm/clientes' },
                        { name: 'Oportunidades', path: '/app/crm/oportunidades' },
                        { name: 'Actividades', path: '/app/crm/actividades' }
                    ]
                },
                {
                    id: 'satisfaccion',
                    title: 'Satisfacción',
                    icon: Heart,
                    items: [
                        { name: 'Satisfacción', path: '/app/satisfaccion-cliente' },
                        { name: 'Encuestas', path: '/app/encuestas' },
                        { name: 'Reportes', path: '/app/reportes' }
                    ]
                }
            ]
        }
    };

    const currentModule = moduleConfigs[moduleType];
    if (!currentModule) return null;

    const toggleSection = (sectionId) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const filteredSections = currentModule.sections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.items.some(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="w-72 bg-gray-900 text-white h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${currentModule.color}-500 rounded-lg flex items-center justify-center`}>
                            <currentModule.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{currentModule.title}</h2>
                            <p className="text-sm text-gray-400">Módulo Especializado</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBackToMainMenu}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={`Buscar en ${currentModule.title}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                    {filteredSections.map((section) => {
                        const isExpanded = expandedSections.includes(section.id);
                        const hasMatchingItems = section.items.some(item =>
                            item.name.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        return (
                            <div key={section.id} className="space-y-1">
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isExpanded || hasMatchingItems
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <section.icon className="w-5 h-5" />
                                        <span className="font-medium">{section.title}</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-8 space-y-1">
                                                {section.items.map((item) => (
                                                    <button
                                                        key={item.path}
                                                        onClick={() => navigate(item.path)}
                                                        className={`w-full text-left p-2 rounded-md transition-colors ${location.pathname === item.path
                                                                ? `bg-${currentModule.color}-600 text-white`
                                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                            }`}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">SGC ISO 9001</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {currentModule.title}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default SecondLevelSidebar;
