import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, FileText, Download, ExternalLink } from 'lucide-react';
import minutasService from '@/services/minutasService';

const MinutaDocumentos = ({ minutaId, isOpen }) => {
  const [documentos, setDocumentos] = useState([]);
  const [documentosDisponibles, setDocumentosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocumento, setNewDocumento] = useState({
    documento_id: '',
    tipo_relacion: 'adjunto',
    descripcion: '',
    es_obligatorio: false
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && minutaId) {
      fetchDocumentos();
      fetchDocumentosDisponibles();
    }
  }, [minutaId, isOpen]);

  const fetchDocumentos = async () => {
    try {
      setLoading(true);
      const data = await minutasService.getDocumentos(minutaId);
      setDocumentos(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar documentos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentosDisponibles = async () => {
    try {
      const data = await minutasService.getDocumentosDisponibles();
      setDocumentosDisponibles(data);
    } catch (error) {
      console.error('Error al cargar documentos disponibles:', error);
    }
  };

  const handleAddDocumento = async () => {
    if (!newDocumento.documento_id) {
      toast({
        title: 'Error',
        description: 'Seleccione un documento',
        variant: 'destructive'
      });
      return;
    }

    try {
      await minutasService.attachDocument(minutaId, {
        ...newDocumento,
        es_obligatorio: newDocumento.es_obligatorio ? 1 : 0
      });
      
      toast({
        title: 'Éxito',
        description: 'Documento agregado'
      });
      
      setNewDocumento({
        documento_id: '',
        tipo_relacion: 'adjunto',
        descripcion: '',
        es_obligatorio: false
      });
      setShowAddForm(false);
      fetchDocumentos();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al agregar documento',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveDocumento = async (documentoId) => {
    try {
      await minutasService.removeDocument(minutaId, documentoId);
      toast({
        title: 'Éxito',
        description: 'Documento eliminado'
      });
      fetchDocumentos();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar documento',
        variant: 'destructive'
      });
    }
  };

  const getTipoDocumentoBadgeColor = (tipo) => {
    switch (tipo) {
      case 'evidencia': return 'bg-green-100 text-green-800';
      case 'acuerdo': return 'bg-blue-100 text-blue-800';
      case 'presentacion': return 'bg-purple-100 text-purple-800';
      case 'procedimiento': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (tipoArchivo) => {
    if (tipoArchivo?.includes('pdf')) return '📄';
    if (tipoArchivo?.includes('word')) return '📝';
    if (tipoArchivo?.includes('excel')) return '📊';
    if (tipoArchivo?.includes('powerpoint')) return '📊';
    return '📁';
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos ({documentos.length})
          </CardTitle>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm" 
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {showAddForm && (
          <Card className="mb-4 bg-gray-50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="documento">Documento</Label>
                  <Select 
                    value={newDocumento.documento_id} 
                    onValueChange={(value) => setNewDocumento(prev => ({...prev, documento_id: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentosDisponibles.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{getFileTypeIcon(doc.tipo_archivo)}</span>
                            <span>{doc.titulo || doc.nombre}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo de Relación</Label>
                  <Select 
                    value={newDocumento.tipo_relacion} 
                    onValueChange={(value) => setNewDocumento(prev => ({...prev, tipo_relacion: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adjunto">Adjunto</SelectItem>
                      <SelectItem value="evidencia">Evidencia</SelectItem>
                      <SelectItem value="acuerdo">Acuerdo</SelectItem>
                      <SelectItem value="presentacion">Presentación</SelectItem>
                      <SelectItem value="procedimiento">Procedimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={newDocumento.descripcion}
                  onChange={(e) => setNewDocumento(prev => ({...prev, descripcion: e.target.value}))}
                  placeholder="Descripción opcional del documento"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="obligatorio"
                  checked={newDocumento.es_obligatorio}
                  onCheckedChange={(checked) => setNewDocumento(prev => ({...prev, es_obligatorio: checked}))}
                />
                <Label htmlFor="obligatorio">Documento obligatorio</Label>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddDocumento} size="sm">
                  Agregar Documento
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-4">Cargando documentos...</div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay documentos adjuntos</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Agregar primer documento
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {documentos.map((documento) => (
              <div 
                key={documento.id} 
                className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getFileTypeIcon(documento.tipo_archivo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {documento.documento_titulo || documento.documento_nombre}
                      </span>
                      <Badge className={getTipoDocumentoBadgeColor(documento.tipo_relacion)}>
                        {documento.tipo_relacion}
                      </Badge>
                      {documento.es_obligatorio === 1 && (
                        <Badge variant="destructive" className="text-xs">
                          Obligatorio
                        </Badge>
                      )}
                    </div>
                    {documento.descripcion && (
                      <p className="text-sm text-gray-600 mb-1">
                        {documento.descripcion}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Tipo: {documento.tipo_archivo || 'Desconocido'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {documento.archivo_url && (
                    <Button
                      onClick={() => window.open(documento.archivo_url, '_blank')}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleRemoveDocumento(documento.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MinutaDocumentos;
