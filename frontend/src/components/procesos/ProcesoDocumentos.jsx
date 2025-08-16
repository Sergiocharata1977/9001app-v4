import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { FileText, Plus, Trash2, Edit2, Download, Eye, FileIcon, BookOpen, ClipboardList, PaperclipIcon, AlertCircle } from 'lucide-react';

// Componente principal para gestionar documentos SGC de un proceso
export default function ProcesoDocumentos({ procesoId, documentos = [], onDocumentosChange }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    documento_id: '',
    tipo_relacion: 'adjunto',
    descripcion: '',
    es_obligatorio: false
  });

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      documento_id: '',
      tipo_relacion: 'adjunto',
      descripcion: '',
      es_obligatorio: false
    });
    setCurrentDocumento(null);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Abrir modal para agregar documento
  const handleAddDocumento = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Abrir modal para editar documento
  const handleEditDocumento = (documento) => {
    setFormData({
      documento_id: documento.documento_id?.toString() || '',
      tipo_relacion: documento.tipo_relacion || 'adjunto',
      descripcion: documento.descripcion || '',
      es_obligatorio: Boolean(documento.es_obligatorio)
    });
    setCurrentDocumento(documento);
    setIsModalOpen(true);
  };

  // Guardar documento (crear o actualizar)
  const handleSaveDocumento = async () => {
    try {
      setLoading(true);
      
      if (!formData.documento_id) {
        toast({
          title: 'Error',
          description: 'El ID del documento es obligatorio',
          variant: 'destructive'
        });
        return;
      }

      const url = currentDocumento 
        ? `/api/procesos/${procesoId}/documentos/${currentDocumento.id}`
        : `/api/procesos/${procesoId}/documentos`;
      
      const method = currentDocumento ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          documento_id: parseInt(formData.documento_id),
          es_obligatorio: formData.es_obligatorio ? 1 : 0
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar documento');
      }

      const result = await response.json();
      
      toast({
        title: 'Éxito',
        description: `Documento ${currentDocumento ? 'actualizado' : 'agregado'} exitosamente`
      });

      // Notificar cambio al componente padre
      if (onDocumentosChange) {
        onDocumentosChange();
      }

      setIsModalOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el documento',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar documento
  const handleDeleteDocumento = async (documentoId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/procesos/${procesoId}/documentos/${documentoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar documento');
      }

      toast({
        title: 'Éxito',
        description: 'Documento eliminado exitosamente'
      });

      // Notificar cambio al componente padre
      if (onDocumentosChange) {
        onDocumentosChange();
      }

      setDocumentoToDelete(null);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el documento',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono según el tipo de relación
  const getTipoIcon = (tipoRelacion) => {
    switch (tipoRelacion) {
      case 'procedimiento': return <BookOpen className="h-4 w-4" />;
      case 'instructivo': return <ClipboardList className="h-4 w-4" />;
      case 'formato': return <FileText className="h-4 w-4" />;
      case 'registro': return <FileIcon className="h-4 w-4" />;
      case 'especificacion': return <PaperclipIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Obtener color del badge según el tipo de relación
  const getTipoColor = (tipoRelacion) => {
    switch (tipoRelacion) {
      case 'procedimiento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'instructivo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'formato': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'registro': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'especificacion': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Documentos SGC</h3>
          <Badge variant="secondary">{documentos.length}</Badge>
        </div>
        
        <Button 
          onClick={handleAddDocumento}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Documento
        </Button>
      </div>

      {/* Lista de documentos */}
      {documentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No hay documentos</h4>
            <p className="text-sm text-gray-500 mb-4">Agrega documentos SGC relacionados con este proceso</p>
            <Button 
              onClick={handleAddDocumento}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Documento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentos.map((documento, index) => (
            <motion.div
              key={documento.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(documento.tipo_relacion)}
                      <CardTitle className="text-sm font-medium truncate">
                        {documento.documento_nombre || `Documento ${documento.documento_id}`}
                      </CardTitle>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEditDocumento(documento)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => setDocumentoToDelete(documento.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Tipo:</span>
                    <Badge className={getTipoColor(documento.tipo_relacion)}>
                      {documento.tipo_relacion}
                    </Badge>
                  </div>
                  
                  {documento.documento_tipo && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Categoría:</span>
                      <span className="text-xs font-medium">{documento.documento_tipo}</span>
                    </div>
                  )}
                  
                  {documento.es_obligatorio && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Obligatorio</span>
                    </div>
                  )}
                  
                  {documento.descripcion && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Descripción:</span>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{documento.descripcion}</p>
                    </div>
                  )}
                  
                  {documento.ruta_archivo && (
                    <div className="mt-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => window.open(documento.ruta_archivo, '_blank')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => window.open(documento.ruta_archivo, '_blank')}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar documento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentDocumento ? 'Editar Documento' : 'Agregar Documento'}
            </DialogTitle>
            <DialogDescription>
              {currentDocumento ? 'Actualiza' : 'Agrega'} los datos del documento SGC
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* ID Documento */}
            <div className="space-y-2">
              <Label htmlFor="documento_id">
                ID Documento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="documento_id"
                name="documento_id"
                type="number"
                value={formData.documento_id}
                onChange={handleInputChange}
                placeholder="Ej: 123"
                required
              />
            </div>

            {/* Tipo de Relación */}
            <div className="space-y-2">
              <Label htmlFor="tipo_relacion">Tipo de Relación</Label>
              <Select 
                value={formData.tipo_relacion} 
                onValueChange={(value) => setFormData(prev => ({...prev, tipo_relacion: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adjunto">Adjunto</SelectItem>
                  <SelectItem value="procedimiento">Procedimiento</SelectItem>
                  <SelectItem value="instructivo">Instructivo</SelectItem>
                  <SelectItem value="formato">Formato</SelectItem>
                  <SelectItem value="registro">Registro</SelectItem>
                  <SelectItem value="especificacion">Especificación</SelectItem>
                  <SelectItem value="evidencia">Evidencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del documento y su relación con el proceso"
                className="min-h-[80px]"
              />
            </div>

            {/* Es Obligatorio */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="es_obligatorio"
                name="es_obligatorio"
                checked={formData.es_obligatorio}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, es_obligatorio: checked}))}
              />
              <Label htmlFor="es_obligatorio" className="text-sm">
                Documento obligatorio para el proceso
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveDocumento}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!documentoToDelete} onOpenChange={() => setDocumentoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la relación del documento con el proceso SGC. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteDocumento(documentoToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
