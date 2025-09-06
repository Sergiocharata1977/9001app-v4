import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { IEstado, IPlantillaRegistro } from '@/types/editorRegistros';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, FileText, Link, Plus, Save, Settings, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Schema de validación
const crearPlantillaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  proceso_id: z.string().optional(),
  categoria: z.string().optional(),
  modulo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  estados: z.array(z.object({
    id: z.string(),
    codigo: z.string(),
    nombre: z.string(),
    descripcion: z.string().optional(),
    orden: z.number(),
    color: z.string(),
    es_inicial: z.boolean(),
    es_final: z.boolean(),
    campos: z.array(z.any())
  })).min(2, 'Debe tener al menos 2 estados (inicial y final)')
});

type CrearPlantillaForm = z.infer<typeof crearPlantillaSchema>;

interface CrearPlantillaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plantilla: IPlantillaRegistro) => void;
  procesosDisponibles?: Array<{ id: string; nombre: string; codigo: string }>;
}

const CrearPlantillaModal: React.FC<CrearPlantillaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  procesosDisponibles = []
}) => {
  const { toast } = useToast();
  const [estados, setEstados] = useState<IEstado[]>([]);
  const [estadoEditando, setEstadoEditando] = useState<string | null>(null);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CrearPlantillaForm>({
    resolver: zodResolver(crearPlantillaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      proceso_id: '',
      categoria: '',
      modulo: '',
      tags: [],
      estados: []
    }
  });

  // Colores predefinidos para estados
  const coloresEstados = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  // Inicializar con estados básicos
  useEffect(() => {
    if (isOpen && estados.length === 0) {
      const estadosIniciales: IEstado[] = [
        {
          id: '1',
          codigo: 'INICIO',
          nombre: 'Iniciado',
          descripcion: 'Estado inicial del registro',
          orden: 1,
          color: '#10B981',
          es_inicial: true,
          es_final: false,
          campos: [],
          transiciones_permitidas: [],
          acciones_automaticas: [],
          tiempo: {
            dias_maximo: undefined,
            dias_alerta: undefined,
            excluir_fines_semana: false,
            excluir_feriados: false
          },
          permisos: {
            puede_crear: ['admin', 'supervisor'],
            puede_editar: ['admin', 'supervisor'],
            puede_mover_desde: [],
            puede_mover_hacia: ['admin', 'supervisor']
          }
        },
        {
          id: '2',
          codigo: 'FINAL',
          nombre: 'Completado',
          descripcion: 'Estado final del registro',
          orden: 2,
          color: '#3B82F6',
          es_inicial: false,
          es_final: true,
          campos: [],
          transiciones_permitidas: [],
          acciones_automaticas: [],
          tiempo: {
            dias_maximo: undefined,
            dias_alerta: undefined,
            excluir_fines_semana: false,
            excluir_feriados: false
          },
          permisos: {
            puede_crear: ['admin', 'supervisor'],
            puede_editar: ['admin', 'supervisor'],
            puede_mover_desde: ['admin', 'supervisor'],
            puede_mover_hacia: []
          }
        }
      ];
      setEstados(estadosIniciales);
      setValue('estados', estadosIniciales);
    }
  }, [isOpen, estados.length, setValue]);

  const agregarEstado = () => {
    const nuevoId = (estados.length + 1).toString();
    const nuevoEstado: IEstado = {
      id: nuevoId,
      codigo: `ESTADO_${nuevoId}`,
      nombre: `Estado ${nuevoId}`,
      descripcion: '',
      orden: estados.length + 1,
      color: coloresEstados[estados.length % coloresEstados.length],
      es_inicial: false,
      es_final: false,
      campos: [],
      transiciones_permitidas: [],
      acciones_automaticas: [],
      tiempo: {
        dias_maximo: undefined,
        dias_alerta: undefined,
        excluir_fines_semana: false,
        excluir_feriados: false
      },
      permisos: {
        puede_crear: ['admin', 'supervisor'],
        puede_editar: ['admin', 'supervisor'],
        puede_mover_desde: ['admin', 'supervisor'],
        puede_mover_hacia: ['admin', 'supervisor']
      }
    };

    const nuevosEstados = [...estados, nuevoEstado];
    setEstados(nuevosEstados);
    setValue('estados', nuevosEstados);
  };

  const eliminarEstado = (estadoId: string) => {
    if (estados.length <= 2) {
      toast({
        title: 'Error',
        description: 'Debe mantener al menos 2 estados (inicial y final)',
        variant: 'destructive'
      });
      return;
    }

    const nuevosEstados = estados.filter(estado => estado.id !== estadoId);
    setEstados(nuevosEstados);
    setValue('estados', nuevosEstados);
  };

  const actualizarEstado = (estadoId: string, campo: keyof IEstado, valor: any) => {
    const nuevosEstados = estados.map(estado => 
      estado.id === estadoId ? { ...estado, [campo]: valor } : estado
    );
    setEstados(nuevosEstados);
    setValue('estados', nuevosEstados);
  };

  const moverEstado = (estadoId: string, direccion: 'arriba' | 'abajo') => {
    const index = estados.findIndex(estado => estado.id === estadoId);
    if (index === -1) return;

    const nuevosEstados = [...estados];
    if (direccion === 'arriba' && index > 0) {
      [nuevosEstados[index], nuevosEstados[index - 1]] = [nuevosEstados[index - 1], nuevosEstados[index]];
    } else if (direccion === 'abajo' && index < estados.length - 1) {
      [nuevosEstados[index], nuevosEstados[index + 1]] = [nuevosEstados[index + 1], nuevosEstados[index]];
    }

    // Actualizar orden
    nuevosEstados.forEach((estado, i) => {
      estado.orden = i + 1;
    });

    setEstados(nuevosEstados);
    setValue('estados', nuevosEstados);
  };

  const onSubmit = (data: CrearPlantillaForm) => {
    // Generar código único
    const codigo = `PLT-${Date.now().toString().slice(-6)}`;
    
    const nuevaPlantilla: IPlantillaRegistro = {
      codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      organizacion_id: 'current-org', // Se debe obtener del contexto
      activo: true,
      categoria: data.categoria,
      modulo: data.modulo,
      tags: data.tags || [],
      proceso_id: data.proceso_id,
      configuracion_visual: {
        icono: 'document',
        color_primario: '#3B82F6',
        vista_default: 'kanban',
        mostrar_progreso: true,
        mostrar_tiempo: true,
        mostrar_responsable: true
      },
      estados: data.estados,
      configuracion_avanzada: {
        numeracion_automatica: {
          activa: true,
          prefijo: codigo,
          formato: '{prefijo}-{año}-{numero}',
          reiniciar_anual: true,
          reiniciar_mensual: false
        },
        versionado: {
          activo: true,
          version_actual: 1,
          historial_cambios: []
        },
        notificaciones: {
          activas: true,
          eventos: ['creacion', 'cambio_estado', 'vencimiento']
        }
      },
      permisos: {
        ver: ['admin', 'supervisor', 'usuario'],
        crear: ['admin', 'supervisor'],
        editar: ['admin', 'supervisor'],
        eliminar: ['admin'],
        exportar: ['admin', 'supervisor'],
        importar: ['admin']
      },
      auditoria: {
        creado_por: 'current-user', // Se debe obtener del contexto
        fecha_creacion: new Date(),
        version: 1,
        cambios_historial: []
      },
      eliminado: false
    };

    onSave(nuevaPlantilla);
    reset();
    setEstados([]);
    onClose();
    
    toast({
      title: 'Plantilla creada',
      description: `La plantilla "${data.nombre}" ha sido creada exitosamente`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Crear Nueva Plantilla de Registro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="campos-globales">Campos Globales</TabsTrigger>
              <TabsTrigger value="estados">Estados</TabsTrigger>
              <TabsTrigger value="proceso">Proceso</TabsTrigger>
              <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            </TabsList>

            {/* Pestaña General */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del Registro *</Label>
                    <Input
                      id="nombre"
                      {...register('nombre')}
                      placeholder="Ej: Registro de Auditoría Interna"
                    />
                    {errors.nombre && (
                      <p className="text-sm text-red-500">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      {...register('descripcion')}
                      placeholder="Describe el propósito de este registro..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoria">Categoría</Label>
                      <Input
                        id="categoria"
                        {...register('categoria')}
                        placeholder="Ej: Calidad, Seguridad"
                      />
                    </div>
                    <div>
                      <Label htmlFor="modulo">Módulo</Label>
                      <Input
                        id="modulo"
                        {...register('modulo')}
                        placeholder="Ej: SGC, RRHH"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña Campos Globales */}
            <TabsContent value="campos-globales" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campos Globales del Proceso</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estos campos aparecen en todos los estados del proceso
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Los campos globales se configuran aquí</p>
                    <p className="text-sm">Ej: Código, Título, Responsable, Fecha de creación, Descripción</p>
                    <Button type="button" className="mt-4" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Campo Global
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña Estados */}
            <TabsContent value="estados" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Estados del Registro</CardTitle>
                    <Button type="button" onClick={agregarEstado} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Estado
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {estados.map((estado, index) => (
                    <Card key={estado.id} className="border-l-4" style={{ borderLeftColor: estado.color }}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: estado.color }}
                            />
                            <div>
                              <h4 className="font-medium">{estado.nombre}</h4>
                              <p className="text-sm text-gray-500">{estado.codigo}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {estado.es_inicial && <Badge variant="secondary">Inicial</Badge>}
                            {estado.es_final && <Badge variant="secondary">Final</Badge>}
                            
                            {/* Botones de mover */}
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moverEstado(estado.id, 'arriba')}
                                disabled={index === 0}
                                className="h-4 w-4 p-0"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moverEstado(estado.id, 'abajo')}
                                disabled={index === estados.length - 1}
                                className="h-4 w-4 p-0"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEstadoEditando(estadoEditando === estado.id ? null : estado.id)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            {estados.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => eliminarEstado(estado.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {estadoEditando === estado.id && (
                          <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <Label>Nombre</Label>
                              <Input
                                value={estado.nombre}
                                onChange={(e) => actualizarEstado(estado.id, 'nombre', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Código</Label>
                              <Input
                                value={estado.codigo}
                                onChange={(e) => actualizarEstado(estado.id, 'codigo', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Color</Label>
                              <div className="flex gap-2">
                                {coloresEstados.map(color => (
                                  <button
                                    key={color}
                                    type="button"
                                    className={`w-6 h-6 rounded-full border-2 ${
                                      estado.color === color ? 'border-gray-800' : 'border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => actualizarEstado(estado.id, 'color', color)}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={estado.es_inicial}
                                  onChange={(e) => actualizarEstado(estado.id, 'es_inicial', e.target.checked)}
                                />
                                Estado Inicial
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={estado.es_final}
                                  onChange={(e) => actualizarEstado(estado.id, 'es_final', e.target.checked)}
                                />
                                Estado Final
                              </label>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña Proceso */}
            <TabsContent value="proceso" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Asociar con Proceso SGC
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="proceso_id">Proceso Asociado</Label>
                    <Select value={procesoSeleccionado} onValueChange={setProcesoSeleccionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proceso del SGC" />
                      </SelectTrigger>
                      <SelectContent>
                        {procesosDisponibles.map(proceso => (
                          <SelectItem key={proceso.id} value={proceso.id}>
                            {proceso.codigo} - {proceso.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      Opcional: Asocia este registro con un proceso específico del SGC
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña Configuración */}
            <TabsContent value="configuracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Numeración Automática</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Activar numeración automática</span>
                      </div>
                    </div>
                    <div>
                      <Label>Notificaciones</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Activar notificaciones</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Crear Plantilla
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrearPlantillaModal;
