import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Users, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import minutasService from '@/services/minutasService';
import MinutaParticipantes from './MinutaParticipantes';
import MinutaDocumentos from './MinutaDocumentos';
import MinutaNormas from './MinutaNormas';

const MinutasModal = ({ isOpen, onClose, onSave, minuta }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    hora_inicio: '09:00',
    hora_fin: '',
    lugar: '',
    tipo: 'reunion',
    agenda: '',
    conclusiones: '',
    acuerdos: '',
    estado: 'borrador',
    // Compatibilidad con sistema anterior
    responsable: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [savedMinutaId, setSavedMinutaId] = useState(null);

  useEffect(() => {
    if (minuta) {
      setFormData({
        titulo: minuta.titulo || '',
        fecha: minuta.fecha || new Date().toISOString().split('T')[0],
        hora_inicio: minuta.hora_inicio || '09:00',
        hora_fin: minuta.hora_fin || '',
        lugar: minuta.lugar || '',
        tipo: minuta.tipo || 'reunion',
        agenda: minuta.agenda || minuta.descripcion || '',
        conclusiones: minuta.conclusiones || '',
        acuerdos: minuta.acuerdos || '',
        estado: minuta.estado || 'borrador',
        responsable: minuta.responsable || '',
        descripcion: minuta.descripcion || ''
      });
      setSavedMinutaId(minuta.id);
    } else {
      setFormData({
        titulo: '',
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: '09:00',
        hora_fin: '',
        lugar: '',
        tipo: 'reunion',
        agenda: '',
        conclusiones: '',
        acuerdos: '',
        estado: 'borrador',
        responsable: '',
        descripcion: ''
      });
      setSavedMinutaId(null);
    }
    setActiveTab('general');
  }, [minuta, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo) {
      toast({ title: 'Error', description: 'Título es obligatorio', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    try {
      let result;
      if (minuta) {
        result = await minutasService.update(minuta.id, formData);
        toast({ title: 'Éxito', description: 'Minuta actualizada' });
      } else {
        result = await minutasService.create(formData);
        toast({ title: 'Éxito', description: 'Minuta creada' });
        // Guardar el ID de la minuta recién creada para permitir agregar participantes/documentos/normas
        if (result && result.id) {
          setSavedMinutaId(result.id);
        }
      }
      onSave();
    } catch (error) {
      toast({ title: 'Error', description: 'Error al guardar minuta', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {minuta ? 'Editar Minuta' : 'Nueva Minuta'}
          </DialogTitle>
          <DialogDescription>
            {minuta ? 'Actualiza los detalles de la minuta y gestiona participantes, documentos y normas ISO' : 'Crea una nueva minuta completa con participantes, documentos y normas ISO'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="participantes" disabled={!savedMinutaId && !minuta} className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participantes
            </TabsTrigger>
            <TabsTrigger value="documentos" disabled={!savedMinutaId && !minuta} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="normas" disabled={!savedMinutaId && !minuta} className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Normas ISO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="titulo" className="text-slate-100">
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ingrese el título de la minuta"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fecha" className="text-slate-100">
                    Fecha
                  </Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo" className="text-slate-100">
                    Tipo de Minuta
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reunion">Reunión</SelectItem>
                      <SelectItem value="auditoria">Auditoría</SelectItem>
                      <SelectItem value="revision">Revisión</SelectItem>
                      <SelectItem value="capacitacion">Capacitación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hora_inicio" className="text-slate-100">
                    Hora Inicio
                  </Label>
                  <Input
                    id="hora_inicio"
                    name="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="hora_fin" className="text-slate-100">
                    Hora Fin
                  </Label>
                  <Input
                    id="hora_fin"
                    name="hora_fin"
                    type="time"
                    value={formData.hora_fin}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="lugar" className="text-slate-100">
                    Lugar
                  </Label>
                  <Input
                    id="lugar"
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    placeholder="Sala de reuniones, virtual, etc."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="responsable" className="text-slate-100">
                    Responsable/Organizador
                  </Label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    placeholder="Nombre del responsable"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="estado" className="text-slate-100">
                    Estado
                  </Label>
                  <Select value={formData.estado} onValueChange={(value) => handleSelectChange('estado', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="borrador">Borrador</SelectItem>
                      <SelectItem value="aprobada">Aprobada</SelectItem>
                      <SelectItem value="archivada">Archivada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="agenda" className="text-slate-100">
                  Agenda
                </Label>
                <Textarea
                  id="agenda"
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  placeholder="Puntos a tratar en la reunión..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="conclusiones" className="text-slate-100">
                  Conclusiones
                </Label>
                <Textarea
                  id="conclusiones"
                  name="conclusiones"
                  value={formData.conclusiones}
                  onChange={handleChange}
                  placeholder="Conclusiones de la reunión..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="acuerdos" className="text-slate-100">
                  Acuerdos y Acciones
                </Label>
                <Textarea
                  id="acuerdos"
                  name="acuerdos"
                  value={formData.acuerdos}
                  onChange={handleChange}
                  placeholder="Acuerdos tomados y acciones a realizar..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              {/* Campo legacy para compatibilidad */}
              <div>
                <Label htmlFor="descripcion" className="text-slate-100">
                  Descripción (Compatibilidad)
                </Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción general (campo legacy)"
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    minuta ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="participantes">
            <MinutaParticipantes 
              minutaId={savedMinutaId || minuta?.id}
              isOpen={activeTab === 'participantes'}
            />
          </TabsContent>

          <TabsContent value="documentos">
            <MinutaDocumentos 
              minutaId={savedMinutaId || minuta?.id}
              isOpen={activeTab === 'documentos'}
            />
          </TabsContent>

          <TabsContent value="normas">
            <MinutaNormas 
              minutaId={savedMinutaId || minuta?.id}
              isOpen={activeTab === 'normas'}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MinutasModal;
