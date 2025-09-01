import axios from 'axios';
import { IRegistro } from '../types/editorRegistros';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FiltrosRegistro {
  plantilla_id?: string;
  estado?: string;
  responsable?: string;
  prioridad?: string;
  vencidos?: boolean;
  busqueda?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  pagina?: number;
  limite?: number;
  ordenar_por?: string;
  orden?: 'asc' | 'desc';
}

interface KanbanData {
  columnas: {
    id: string;
    nombre: string;
    color: string;
    orden: number;
    registros: IRegistro[];
  }[];
  estadisticas: {
    estado_id: string;
    total: number;
    vencidos: number;
    urgentes: number;
  }[];
  total_registros: number;
}

class RegistroService {
  private baseURL = `${API_URL}/registros-dinamicos`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // CRUD básico
  async crear(datos: {
    plantilla_id: string;
    datos_iniciales?: Record<string, any>;
    responsable_principal?: string;
    fecha_limite?: Date;
    estado_inicial_id?: string;
  }): Promise<IRegistro> {
    const response = await axios.post(this.baseURL, datos, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async listar(filtros?: FiltrosRegistro): Promise<{
    data: IRegistro[];
    pagination: {
      total: number;
      pagina: number;
      limite: number;
      paginas: number;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await axios.get(`${this.baseURL}?${params.toString()}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async obtenerPorId(id: string): Promise<IRegistro> {
    const response = await axios.get(`${this.baseURL}/${id}`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async actualizar(id: string, datos: {
    datos?: Record<string, any>;
    responsable_principal?: string;
    fecha_limite?: Date;
    prioridad?: string;
    etiquetas?: any[];
  }): Promise<IRegistro> {
    const response = await axios.put(`${this.baseURL}/${id}`, datos, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async archivar(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Vista Kanban
  async obtenerVistaKanban(plantillaId: string, filtros?: any): Promise<KanbanData> {
    const params = filtros ? `?filtros=${JSON.stringify(filtros)}` : '';
    const response = await axios.get(
      `${this.baseURL}/kanban/${plantillaId}${params}`,
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Gestión de estados
  async cambiarEstado(registroId: string, nuevoEstadoId: string, datos?: {
    comentario?: string;
    validar_transicion?: boolean;
  }): Promise<IRegistro> {
    const response = await axios.put(
      `${this.baseURL}/${registroId}/cambiar-estado`,
      {
        nuevo_estado_id: nuevoEstadoId,
        ...datos
      },
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  async obtenerEstadosPermitidos(registroId: string): Promise<{
    estado_actual: {
      id: string;
      nombre: string;
      color: string;
    };
    estados_permitidos: {
      id: string;
      nombre: string;
      color: string;
      requiere_comentario: boolean;
      condiciones: any[];
    }[];
  }> {
    const response = await axios.get(
      `${this.baseURL}/${registroId}/estados-permitidos`,
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Comentarios
  async agregarComentario(registroId: string, datos: {
    texto: string;
    archivos?: string[];
    menciones?: string[];
    respuesta_a?: string;
  }): Promise<any> {
    const response = await axios.post(
      `${this.baseURL}/${registroId}/comentarios`,
      datos,
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Archivos
  async subirArchivo(registroId: string, archivo: File, datos?: {
    campo_id?: string;
    descripcion?: string;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    if (datos) {
      Object.entries(datos).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
    }

    const response = await axios.post(
      `${this.baseURL}/${registroId}/archivos`,
      formData,
      {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data;
  }

  // Checklist
  async actualizarChecklist(registroId: string, checklist: any[]): Promise<{
    data: any[];
    progreso: number;
  }> {
    const response = await axios.put(
      `${this.baseURL}/${registroId}/checklist`,
      { checklist },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  // Operaciones especiales
  async bloquear(registroId: string, motivo?: string): Promise<void> {
    await axios.post(
      `${this.baseURL}/${registroId}/bloquear`,
      { motivo },
      { headers: this.getHeaders() }
    );
  }

  async desbloquear(registroId: string): Promise<void> {
    await axios.post(
      `${this.baseURL}/${registroId}/bloquear`,
      {},
      { headers: this.getHeaders() }
    );
  }

  async clonar(registroId: string, codigoPersonalizado?: string): Promise<IRegistro> {
    const response = await axios.post(
      `${this.baseURL}/${registroId}/clonar`,
      { codigo_personalizado: codigoPersonalizado },
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Exportación
  async exportar(filtros?: {
    formato?: 'excel' | 'pdf' | 'json';
    plantilla_id?: string;
    [key: string]: any;
  }): Promise<Blob | any> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'filtros' && typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await axios.get(
      `${this.baseURL}/exportar?${params.toString()}`,
      {
        headers: this.getHeaders(),
        responseType: filtros?.formato === 'json' ? 'json' : 'blob'
      }
    );
    return response.data;
  }

  // Métricas y estadísticas
  async obtenerMetricas(plantillaId: string): Promise<{
    total_registros: number;
    por_estado: Record<string, number>;
    por_prioridad: Record<string, number>;
    vencidos: number;
    proximos_vencer: number;
    tiempo_promedio_resolucion: number;
    eficiencia: number;
  }> {
    const response = await axios.get(
      `${this.baseURL}/metricas/${plantillaId}`,
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Actividad y auditoría
  async obtenerActividad(registroId: string, limite: number = 50): Promise<any[]> {
    const response = await axios.get(
      `${this.baseURL}/${registroId}/actividad?limite=${limite}`,
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Notificaciones
  async marcarNotificacionLeida(registroId: string, notificacionId: string): Promise<void> {
    await axios.put(
      `${this.baseURL}/${registroId}/notificaciones/${notificacionId}/leida`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // WebSocket para actualizaciones en tiempo real
  conectarWebSocket(plantillaId: string, callbacks: {
    onRegistroCreado?: (registro: IRegistro) => void;
    onRegistroActualizado?: (registro: IRegistro) => void;
    onRegistroMovido?: (data: { registroId: string; estadoAnterior: string; estadoNuevo: string }) => void;
    onComentarioAgregado?: (data: { registroId: string; comentario: any }) => void;
  }): () => void {
    // Implementar conexión WebSocket
    // Por ahora retornamos una función de limpieza vacía
    console.log('WebSocket no implementado aún');
    return () => {};
  }
}

export const registroService = new RegistroService();