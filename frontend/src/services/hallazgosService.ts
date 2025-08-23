import { createApiClient } from './apiService';
import type { Hallazgo, HallazgoFormData, HallazgoEstado } from '../types/hallazgos';

const apiClient = createApiClient('/hallazgos');

interface HallazgoEstadoUpdateData {
  estado: HallazgoEstado;
}

interface HallazgoOrderUpdateData {
  orderedIds: string[];
}

export const hallazgosService = {
  /**
   * Obtiene todos los hallazgos.
   * @returns {Promise<Hallazgo[]>} Lista de hallazgos.
   */
  async getAllHallazgos(): Promise<Hallazgo[]> {
    try {
      const data: Hallazgo[] = await apiClient.get('/');
      // Validación defensiva
      const safeData = Array.isArray(data) ? data : [];
      console.log('🚀 DEBUG: Hallazgos obtenidos del API:', safeData);
      console.log('🚀 DEBUG: Cantidad de hallazgos del API:', safeData?.length);
      
      // Inspeccionar estructura de los primeros 3 hallazgos
      console.log('🔍 DEBUG: Estructura de los primeros 3 hallazgos:');
      safeData?.slice(0, 3).forEach((h: Hallazgo, i: number) => {
        console.log(`   Hallazgo ${i+1}:`, {
          id: h.id,
          numeroHallazgo: h.numeroHallazgo,
          titulo: h.titulo,
          estado: h.estado,
          hasId: !!h.id,
          hasEstado: !!h.estado,
          allKeys: Object.keys(h)
        });
      });
      
      return safeData;
    } catch (error) {
      console.error('Error al obtener los hallazgos:', error);
      throw new Error((error as Error).message || 'Error al cargar los hallazgos');
    }
  },

  /**
   * Obtiene un hallazgo por su ID.
   * @param {number} id - ID del hallazgo.
   * @returns {Promise<Hallazgo>} Datos del hallazgo.
   */
  async getHallazgoById(id: number): Promise<Hallazgo> {
    try {
      const data: Hallazgo = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener el hallazgo con ID ${id}:`, error);
      throw new Error((error as Error).message || 'Error al cargar el hallazgo');
    }
  },

  /**
   * Crea un nuevo hallazgo.
   * @param {HallazgoFormData} hallazgoData - Datos del hallazgo a crear.
   * @returns {Promise<Hallazgo>} El hallazgo creado.
   */
  async createHallazgo(hallazgoData: HallazgoFormData): Promise<Hallazgo> {
    try {
      const data: Hallazgo = await apiClient.post('/', hallazgoData);
      return data;
    } catch (error) {
      console.error('Error al crear el hallazgo:', error);
      throw new Error((error as Error).message || 'Error al crear el hallazgo');
    }
  },

  /**
   * Actualiza un hallazgo existente.
   * @param {number} id - ID del hallazgo a actualizar.
   * @param {Partial<HallazgoFormData>} hallazgoData - Datos actualizados del hallazgo.
   * @returns {Promise<Hallazgo>} El hallazgo actualizado.
   */
  async updateHallazgo(id: number, hallazgoData: Partial<HallazgoFormData>): Promise<Hallazgo> {
    try {
      const data: Hallazgo = await apiClient.put(`/${id}`, hallazgoData);
      return data;
    } catch (error) {
      console.error(`Error al actualizar el hallazgo con ID ${id}:`, error);
      throw new Error((error as Error).message || 'Error al actualizar el hallazgo');
    }
  },

  /**
   * Elimina un hallazgo.
   * @param {number} id - ID del hallazgo a eliminar.
   * @returns {Promise<void>}
   */
  async deleteHallazgo(id: number): Promise<void> {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el hallazgo con ID ${id}:`, error);
      throw new Error((error as Error).message || 'Error al eliminar el hallazgo');
    }
  },

  /**
   * Actualiza el estado de un hallazgo.
   * @param {number} id - ID del hallazgo a actualizar.
   * @param {HallazgoEstado} estado - Nuevo estado del hallazgo.
   * @returns {Promise<any>}
   */
  async updateHallazgoEstado(id: number, estado: HallazgoEstado): Promise<any> {
    try {
      const response = await apiClient.put(`/mejoras/${id}/estado`, { estado } as HallazgoEstadoUpdateData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del hallazgo con ID ${id}:`, error);
      throw new Error((error as Error).message || 'Error al actualizar el estado del hallazgo');
    }
  },

  /**
   * Actualiza el orden de los hallazgos.
   * @param {string[]} orderedIds - Lista de IDs ordenados.
   * @returns {Promise<any>} La respuesta del servidor.
   */
  async updateHallazgosOrder(orderedIds: string[]): Promise<any> {
    try {
      const response = await apiClient.put('/mejoras/orden', { orderedIds } as HallazgoOrderUpdateData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el orden de los hallazgos:', error);
      throw new Error((error as Error).message || 'Error al actualizar el orden de los hallazgos');
    }
  },
};

export default hallazgosService;