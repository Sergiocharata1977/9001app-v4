import {
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { getFileStructure, regenerateFileStructure } from '../../services/fileStructureService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';

const FileStructureViewer = () => {
  const [fileStructure, setFileStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedSection, setSelectedSection] = useState('all');

  useEffect(() => {
    fetchFileStructure();
  }, []);

  const fetchFileStructure = async () => {
    try {
      setLoading(true);
      const response = await getFileStructure();
      setFileStructure(response.data);
    } catch (err) {
      setError('Error al cargar la estructura de archivos');
      console.error('Error fetching file structure:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const response = await regenerateFileStructure();
      setFileStructure(response.data);
    } catch (err) {
      setError('Error al regenerar la estructura de archivos');
      console.error('Error regenerating file structure:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getStatusIcon = (status) => {
    if (status.includes('✅')) return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    if (status.includes('⚠️')) return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
    return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status) => {
    if (status.includes('✅')) return 'bg-green-100 text-green-800';
    if (status.includes('⚠️')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderFolderTree = (structure, parentPath = '') => {
    return Object.entries(structure).map(([folderName, folderData]) => {
      const fullPath = parentPath ? `${parentPath}/${folderName}` : folderName;
      const isExpanded = expandedFolders.has(fullPath);
      const hasChildren = folderData.structure && Object.keys(folderData.structure).length > 0;

      return (
        <div key={fullPath} className="ml-4">
          <div
            className="flex items-center py-1 hover:bg-gray-50 cursor-pointer"
            onClick={() => hasChildren && toggleFolder(fullPath)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500 mr-2" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500 mr-2" />
              )
            ) : (
              <div className="w-4 mr-2" />
            )}
            <FolderIcon className="w-4 h-4 text-blue-500 mr-2" />
            <span className="font-medium">{folderName}</span>
            <Badge className={`ml-2 ${getStatusColor(folderData.status)}`}>
              {getStatusIcon(folderData.status)}
              <span className="ml-1">{folderData.status}</span>
            </Badge>
            <span className="ml-auto text-sm text-gray-500">
              {folderData.files} archivos, {folderData.lines.toLocaleString()} líneas
            </span>
          </div>
          {isExpanded && hasChildren && (
            <div className="ml-4">
              {renderFolderTree(folderData.structure, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredFileTypes = fileStructure?.fileTypes.filter(type =>
    type.extension.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Cargando estructura de archivos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchFileStructure}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DocumentIcon className="w-6 h-6 mr-2" />
            Estructura de Archivos del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{fileStructure?.totalFiles.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total de Archivos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{fileStructure?.totalLines.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total de Líneas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{fileStructure?.lastUpdate}</div>
              <div className="text-sm text-gray-600">Última Actualización</div>
            </div>
            <div className="text-center">
              <Badge className={getStatusColor(fileStructure?.status)}>
                {getStatusIcon(fileStructure?.status)}
                <span className="ml-1">{fileStructure?.status}</span>
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Estado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por tipo de archivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedSection === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedSection('all')}
          >
            Todos
          </Button>
          <Button
            variant={selectedSection === 'backend' ? 'default' : 'outline'}
            onClick={() => setSelectedSection('backend')}
          >
            Backend
          </Button>
          <Button
            variant={selectedSection === 'frontend' ? 'default' : 'outline'}
            onClick={() => setSelectedSection('frontend')}
          >
            Frontend
          </Button>
          <Button
            variant={selectedSection === 'documentation' ? 'default' : 'outline'}
            onClick={() => setSelectedSection('documentation')}
          >
            Documentación
          </Button>
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={loading}
            className="ml-auto"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Regenerar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estructura de Carpetas */}
        <Card>
          <CardHeader>
            <CardTitle>Estructura de Carpetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(fileStructure?.sections || {}).map(([sectionKey, section]) => {
                if (selectedSection !== 'all' && selectedSection !== sectionKey) return null;

                return (
                  <div key={sectionKey} className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">{section.icon}</span>
                      <h3 className="font-semibold">{section.name}</h3>
                      <Badge className={`ml-2 ${getStatusColor(section.status)}`}>
                        {getStatusIcon(section.status)}
                        <span className="ml-1">{section.status}</span>
                      </Badge>
                      <span className="ml-auto text-sm text-gray-500">
                        {section.files} archivos, {section.lines.toLocaleString()} líneas
                      </span>
                    </div>
                    <div className="space-y-1">
                      {renderFolderTree(section.structure)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Archivo */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Archivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredFileTypes.map((fileType) => (
                <div key={fileType.extension} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mr-3">
                      {fileType.extension}
                    </span>
                    <Badge className={getStatusColor(fileType.status)}>
                      {getStatusIcon(fileType.status)}
                      <span className="ml-1">{fileType.status}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{fileType.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{fileType.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comandos de Actualización */}
      <Card>
        <CardHeader>
          <CardTitle>Comandos de Actualización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Actualización Manual</h4>
              <div className="space-y-1 text-sm">
                <code className="block bg-gray-100 p-2 rounded">npm run file-structure:update</code>
                <code className="block bg-gray-100 p-2 rounded">npm run file-structure:status</code>
                <code className="block bg-gray-100 p-2 rounded">npm run file-structure:excel</code>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Actualización Automática</h4>
              <div className="space-y-1 text-sm">
                <code className="block bg-gray-100 p-2 rounded">npm run file-structure:scheduler:start</code>
                <code className="block bg-gray-100 p-2 rounded">npm run file-structure:scheduler:pm2-start</code>
                <code className="block bg-gray-100 p-2 rounded">npm run file-structure:scheduler:stop</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileStructureViewer;
