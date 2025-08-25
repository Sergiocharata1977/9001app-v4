import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  Table, 
  RefreshCw,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Key,
  Link,
  Info
} from 'lucide-react';

const DatabaseSchemaViewer = () => {
  const [schemaData, setSchemaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTables, setExpandedTables] = useState(new Set());

  useEffect(() => {
    loadSchemaData();
    // Actualizar cada hora
    const interval = setInterval(loadSchemaData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadSchemaData = async () => {
    try {
      const response = await fetch('/api/database/schema');
      const data = await response.json();
      setSchemaData(data);
      setLastUpdate(new Date(data.lastUpdate));
      setLoading(false);
    } catch (error) {
      console.error('Error cargando esquema:', error);
      setLoading(false);
    }
  };

  const handleManualUpdate = async () => {
    setLoading(true);
    try {
      await fetch('/api/database/schema/update', { method: 'POST' });
      await loadSchemaData();
    } catch (error) {
      console.error('Error en actualización manual:', error);
    }
  };

  const toggleTableExpansion = (tableName) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getTableCategories = () => {
    const categories = {
      'Organizaciones y Usuarios': ['organizations', 'organization_features', 'user_feature_permissions'],
      'Gestión de Personal': ['personal', 'departamentos', 'puestos', 'competencias'],
      'Procesos y Documentos': ['procesos', 'documentos', 'normas'],
      'Auditorías y Calidad': ['auditorias', 'hallazgos', 'acciones'],
      'Indicadores y Objetivos': ['indicadores', 'mediciones', 'objetivos_calidad'],
      'Comunicación': ['minutas'],
      'Capacitación': ['capacitaciones'],
      'Productos': ['productos'],
      'Sistema': ['sqlite_sequence']
    };
    return categories;
  };

  const getFilteredTables = () => {
    if (!schemaData) return [];
    
    const categories = getTableCategories();
    let tables = Object.entries(schemaData.tables);
    
    // Filtrar por búsqueda
    if (searchTerm) {
      tables = tables.filter(([tableName, table]) => 
        tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.columns.some(col => col.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      const categoryTables = categories[selectedCategory] || [];
      tables = tables.filter(([tableName]) => categoryTables.includes(tableName));
    }
    
    return tables;
  };

  const getColumnTypeColor = (type) => {
    if (type.includes('INTEGER')) return 'bg-blue-100 text-blue-800';
    if (type.includes('TEXT')) return 'bg-green-100 text-green-800';
    if (type.includes('REAL')) return 'bg-purple-100 text-purple-800';
    if (type.includes('DATETIME')) return 'bg-orange-100 text-orange-800';
    if (type.includes('DATE')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando estructura de base de datos...</span>
      </div>
    );
  }

  const filteredTables = getFilteredTables();
  const categories = getTableCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Estructura Completa de Base de Datos
            </h1>
            <p className="text-gray-600">
              Documentación técnica completa - Tabla por tabla, campo por campo
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleManualUpdate} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar Ahora
            </Button>
            {lastUpdate && (
              <Badge variant="outline">
                Última actualización: {lastUpdate.toLocaleString('es-ES')}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Estadísticas Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{schemaData.totalTables}</div>
              <div className="text-sm text-gray-600">Total de Tablas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(schemaData.tables).reduce((sum, table) => sum + table.columns.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total de Campos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(schemaData.tables).reduce((sum, table) => sum + table.relations.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total de Relaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.values(schemaData.tables).reduce((sum, table) => sum + table.recordCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total de Registros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tabla o campo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las Categorías</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Mostrando {filteredTables.length} de {Object.keys(schemaData.tables).length} tablas</span>
          {searchTerm && <span>• Filtrado por: "{searchTerm}"</span>}
          {selectedCategory !== 'all' && <span>• Categoría: {selectedCategory}</span>}
        </div>
      </div>

      {/* Lista Completa de Tablas */}
      <div className="space-y-6">
        {filteredTables.map(([tableName, table]) => (
          <Card key={tableName} className="shadow-lg">
            <CardHeader 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer"
              onClick={() => toggleTableExpansion(tableName)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {expandedTables.has(tableName) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <Table className="w-5 h-5" />
                  <span className="font-mono">{tableName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {table.recordCount} registros
                  </Badge>
                  <Badge variant="secondary">
                    {table.columns.length} campos
                  </Badge>
                  {table.relations.length > 0 && (
                    <Badge variant="secondary">
                      {table.relations.length} relaciones
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            {expandedTables.has(tableName) && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Campos de la Tabla */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      Campos de la Tabla ({table.columns.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Campo</th>
                            <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Tipo</th>
                            <th className="border border-gray-200 px-4 py-2 text-center font-semibold">Requerido</th>
                            <th className="border border-gray-200 px-4 py-2 text-center font-semibold">Clave Primaria</th>
                            <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Valor por Defecto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((column, index) => (
                            <tr key={column.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="border border-gray-200 px-4 py-2 font-mono text-sm">
                                <div className="flex items-center space-x-2">
                                  <span>{column.name}</span>
                                  {column.primaryKey && (
                                    <Badge variant="destructive" className="text-xs">PK</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="border border-gray-200 px-4 py-2">
                                <Badge className={`text-xs ${getColumnTypeColor(column.type)}`}>
                                  {column.type}
                                </Badge>
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-center">
                                {column.notNull ? (
                                  <Badge variant="secondary" className="text-xs">✅ Sí</Badge>
                                ) : (
                                  <span className="text-gray-400">❌ No</span>
                                )}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-center">
                                {column.primaryKey ? (
                                  <Badge variant="destructive" className="text-xs">✅ Sí</Badge>
                                ) : (
                                  <span className="text-gray-400">❌ No</span>
                                )}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 font-mono text-sm">
                                {column.defaultValue || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Relaciones */}
                  {table.relations.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Link className="w-4 h-4 mr-2" />
                        Relaciones ({table.relations.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {table.relations.map((relation, index) => (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">FK</Badge>
                              <span className="font-mono text-sm">{relation.column}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              → <span className="font-mono">{relation.referencesTable}.{relation.referencesColumn}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ON UPDATE: {relation.onUpdate || 'NO ACTION'} | ON DELETE: {relation.onDelete || 'NO ACTION'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Índices */}
                  {table.indexes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Info className="w-4 h-4 mr-2" />
                        Índices ({table.indexes.length})
                      </h4>
                      <div className="space-y-2">
                        {table.indexes.map((index) => (
                          <div key={index.name} className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                            <span className="font-mono text-sm">{index.name}</span>
                            {index.unique && (
                              <Badge variant="outline" className="text-xs">Único</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información Adicional */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Información Adicional</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Registros:</span> {table.recordCount}
                      </div>
                      <div>
                        <span className="font-semibold">Última Análisis:</span> {new Date(table.lastAnalyzed).toLocaleString('es-ES')}
                      </div>
                      <div>
                        <span className="font-semibold">Tamaño Estimado:</span> {Math.round(table.recordCount * table.columns.length * 0.1)} KB
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredTables.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500">
              <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron tablas</h3>
              <p>Intenta ajustar los filtros de búsqueda o categoría</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseSchemaViewer; 