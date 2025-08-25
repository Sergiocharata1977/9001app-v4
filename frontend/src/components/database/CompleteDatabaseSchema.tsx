import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Database, Table, RefreshCw, Search, ChevronDown, ChevronRight } from 'lucide-react';

const CompleteDatabaseSchema = () => {
  const [schemaData, setSchemaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState(new Set());

  useEffect(() => {
    loadSchemaData();
  }, []);

  const loadSchemaData = async () => {
    try {
      const response = await fetch('/api/database/schema');
      const data = await response.json();
      setSchemaData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando esquema:', error);
      setLoading(false);
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

  const getFilteredTables = () => {
    if (!schemaData) return [];
    
    let tables = Object.entries(schemaData.tables);
    
    if (searchTerm) {
      tables = tables.filter(([tableName, table]) => 
        tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.columns.some(col => col.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return tables;
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estructura Completa de Base de Datos
        </h1>
        <p className="text-gray-600">
          Tabla por tabla, campo por campo - Documentación técnica completa
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tabla o campo específico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Mostrando {filteredTables.length} de {Object.keys(schemaData.tables).length} tablas
        </div>
      </div>

      <div className="space-y-4">
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
                  <span className="font-mono text-lg">{tableName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {table.recordCount} registros
                  </Badge>
                  <Badge variant="secondary">
                    {table.columns.length} campos
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            
            {expandedTables.has(tableName) && (
              <CardContent className="p-6">
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
                            <Badge variant="outline" className="text-xs">
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
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompleteDatabaseSchema;
