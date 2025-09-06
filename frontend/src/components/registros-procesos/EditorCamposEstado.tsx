import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ICampo, IEstado, TipoCampo } from '@/types/editorRegistros';
import {
    Calendar,
    CheckSquare, FileText,
    Hash,
    Image,
    Link,
    Mail,
    Minus,
    Phone,
    Plus,
    Save,
    Settings,
    Star, ToggleLeft,
    Type,
    Upload,
    User,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface EditorCamposEstadoProps {
  estado: IEstado;
  isOpen: boolean;
  onClose: () => void;
  onSave: (estado: IEstado) => void;
}

const EditorCamposEstado: React.FC<EditorCamposEstadoProps> = ({
  estado,
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [campos, setCampos] = useState<ICampo[]>(estado.campos || []);
  const [campoEditando, setCampoEditando] = useState<ICampo | null>(null);
  const [isModalCampoOpen, setIsModalCampoOpen] = useState(false);

  // Tipos de campos disponibles
  const tiposCampos = [
    { value: 'text', label: 'Texto', icon: Type, description: 'Campo de texto simple' },
    { value: 'textarea', label: 'Área de Texto', icon: FileText, description: 'Texto multilínea' },
    { value: 'number', label: 'Número', icon: Hash, description: 'Valor numérico' },
    { value: 'date', label: 'Fecha', icon: Calendar, description: 'Selección de fecha' },
    { value: 'select', label: 'Selección', icon: CheckSquare, description: 'Lista desplegable' },
    { value: 'checkbox', label: 'Casilla', icon: CheckSquare, description: 'Verdadero/Falso' },
    { value: 'user', label: 'Usuario', icon: User, description: 'Selección de usuario' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Dirección de correo' },
    { value: 'phone', label: 'Teléfono', icon: Phone, description: 'Número telefónico' },
    { value: 'url', label: 'URL', icon: Link, description: 'Enlace web' },
    { value: 'file', label: 'Archivo', icon: Upload, description: 'Subida de archivo' },
    { value: 'image', label: 'Imagen', icon: Image, description: 'Subida de imagen' },
    { value: 'rating', label: 'Calificación', icon: Star, description: 'Sistema de estrellas' },
    { value: 'switch', label: 'Interruptor', icon: ToggleLeft, description: 'On/Off' },
    { value: 'separator', label: 'Separador', icon: Minus, description: 'Línea divisoria' }
  ];

  const agregarCampo = () => {
    const nuevoCampo: ICampo = {
      id: `campo_${Date.now()}`,
      codigo: `campo_${campos.length + 1}`,
      etiqueta: 'Nuevo Campo',
      descripcion: '',
      tipo: 'text' as TipoCampo,
      requerido: false,
      solo_lectura: false,
      visible_tarjeta: true,
      orden_tarjeta: campos.length + 1,
      orden_formulario: campos.length + 1,
      configuracion: {},
      validaciones: [],
      permisos: {
        ver: ['admin', 'supervisor', 'usuario'],
        editar: ['admin', 'supervisor'],
        requerido_para: []
      },
      valor_default: '',
      ayuda: '',
      placeholder: '',
      grupo: 'general'
    };

    setCampoEditando(nuevoCampo);
    setIsModalCampoOpen(true);
  };

  const editarCampo = (campo: ICampo) => {
    setCampoEditando(campo);
    setIsModalCampoOpen(true);
  };

  const eliminarCampo = (campoId: string) => {
    setCampos(campos.filter(campo => campo.id !== campoId));
  };

  const guardarCampo = (campo: ICampo) => {
    if (campoEditando && campos.find(c => c.id === campoEditando.id)) {
      // Editar campo existente
      setCampos(campos.map(c => c.id === campo.id ? campo : c));
    } else {
      // Agregar nuevo campo
      setCampos([...campos, campo]);
    }
    setIsModalCampoOpen(false);
    setCampoEditando(null);
  };

  const moverCampo = (campoId: string, direccion: 'arriba' | 'abajo') => {
    const index = campos.findIndex(c => c.id === campoId);
    if (index === -1) return;

    const nuevosCampos = [...campos];
    if (direccion === 'arriba' && index > 0) {
      [nuevosCampos[index], nuevosCampos[index - 1]] = [nuevosCampos[index - 1], nuevosCampos[index]];
    } else if (direccion === 'abajo' && index < campos.length - 1) {
      [nuevosCampos[index], nuevosCampos[index + 1]] = [nuevosCampos[index + 1], nuevosCampos[index]];
    }

    // Actualizar orden
    nuevosCampos.forEach((campo, i) => {
      campo.orden_formulario = i + 1;
      campo.orden_tarjeta = i + 1;
    });

    setCampos(nuevosCampos);
  };

  const handleSave = () => {
    const estadoActualizado = {
      ...estado,
      campos: campos
    };
    onSave(estadoActualizado);
    onClose();
    
    toast({
      title: 'Campos actualizados',
      description: `Se han actualizado los campos del estado "${estado.nombre}"`,
    });
  };

  const getTipoIcon = (tipo: string) => {
    const tipoInfo = tiposCampos.find(t => t.value === tipo);
    return tipoInfo ? tipoInfo.icon : Type;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurar Campos - {estado.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Información del Estado */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: estado.color }}
                  />
                  <div>
                    <h3 className="font-medium">{estado.nombre}</h3>
                    <p className="text-sm text-gray-500">{estado.codigo}</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    {estado.es_inicial && <Badge variant="secondary">Inicial</Badge>}
                    {estado.es_final && <Badge variant="secondary">Final</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campos del Proceso (Globales) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Campos del Proceso (Globales)</CardTitle>
                  <Button onClick={agregarCampo} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Campo Global
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estos campos aparecen en todos los estados del proceso
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Los campos globales se configuran en la plantilla principal</p>
                  <p className="text-sm">Ej: Código, Título, Responsable, Fecha de creación</p>
                </div>
              </CardContent>
            </Card>

            {/* Campos del Estado (Específicos) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Campos del Estado (Específicos)</CardTitle>
                  <Button onClick={agregarCampo} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Campo del Estado
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estos campos solo aparecen en el estado "{estado.nombre}"
                </p>
              </CardHeader>
              <CardContent>
                {campos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay campos configurados para este estado</p>
                    <p className="text-sm">Haz clic en "Agregar Campo" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {campos.map((campo, index) => {
                      const IconComponent = getTipoIcon(campo.tipo);
                      return (
                        <Card key={campo.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5 text-gray-500" />
                                <div>
                                  <h4 className="font-medium">{campo.etiqueta}</h4>
                                  <p className="text-sm text-gray-500">
                                    {campo.codigo} • {tiposCampos.find(t => t.value === campo.tipo)?.label}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {campo.requerido && <Badge variant="destructive" className="text-xs">Requerido</Badge>}
                                {campo.solo_lectura && <Badge variant="secondary" className="text-xs">Solo lectura</Badge>}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editarCampo(campo)}
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => eliminarCampo(campo.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Campos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar campo individual */}
      {isModalCampoOpen && campoEditando && (
        <EditorCampoIndividual
          campo={campoEditando}
          isOpen={isModalCampoOpen}
          onClose={() => {
            setIsModalCampoOpen(false);
            setCampoEditando(null);
          }}
          onSave={guardarCampo}
          tiposCampos={tiposCampos}
        />
      )}
    </>
  );
};

// Componente para editar un campo individual
interface EditorCampoIndividualProps {
  campo: ICampo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (campo: ICampo) => void;
  tiposCampos: Array<{ value: string; label: string; icon: any; description: string }>;
}

const EditorCampoIndividual: React.FC<EditorCampoIndividualProps> = ({
  campo,
  isOpen,
  onClose,
  onSave,
  tiposCampos
}) => {
  const [campoEditado, setCampoEditado] = useState<ICampo>({ ...campo });

  const handleSave = () => {
    onSave(campoEditado);
  };

  const actualizarCampo = (campo: keyof ICampo, valor: any) => {
    setCampoEditado(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Campo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Etiqueta *</Label>
              <Input
                value={campoEditado.etiqueta}
                onChange={(e) => actualizarCampo('etiqueta', e.target.value)}
                placeholder="Nombre del campo"
              />
            </div>
            <div>
              <Label>Código *</Label>
              <Input
                value={campoEditado.codigo}
                onChange={(e) => actualizarCampo('codigo', e.target.value)}
                placeholder="codigo_campo"
              />
            </div>
          </div>

          <div>
            <Label>Tipo de Campo *</Label>
            <Select value={campoEditado.tipo} onValueChange={(valor) => actualizarCampo('tipo', valor)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tiposCampos.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    <div className="flex items-center gap-2">
                      <tipo.icon className="h-4 w-4" />
                      {tipo.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Descripción</Label>
            <Input
              value={campoEditado.descripcion || ''}
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
              placeholder="Descripción del campo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Placeholder</Label>
              <Input
                value={campoEditado.placeholder || ''}
                onChange={(e) => actualizarCampo('placeholder', e.target.value)}
                placeholder="Texto de ayuda"
              />
            </div>
            <div>
              <Label>Valor por defecto</Label>
              <Input
                value={campoEditado.valor_default || ''}
                onChange={(e) => actualizarCampo('valor_default', e.target.value)}
                placeholder="Valor inicial"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campoEditado.requerido}
                onChange={(e) => actualizarCampo('requerido', e.target.checked)}
              />
              Campo requerido
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campoEditado.solo_lectura}
                onChange={(e) => actualizarCampo('solo_lectura', e.target.checked)}
              />
              Solo lectura
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campoEditado.visible_tarjeta}
                onChange={(e) => actualizarCampo('visible_tarjeta', e.target.checked)}
              />
              Visible en tarjeta
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Campo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditorCamposEstado;
