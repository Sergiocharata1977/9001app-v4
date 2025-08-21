import { createApiClient } from './apiService';
import { useState } from 'react';

const api = createApiClient('/file-structure');

/**
 * Servicio para la estructura de archivos del sistema
 * Proporciona métodos para obtener información sobre la estructura de archivos
 */

/**
 * Obtiene la estructura completa de archivos del sistema
 * @returns {Promise<Object>} Estructura de archivos
 */
export const getFileStructure = async () => {
  try {
    const response = await api.get('/file-structure');
    return response.data;
  } catch (error) {
    console.error('Error fetching file structure:', error);
    throw error;
  }
};

/**
 * Regenera la estructura de archivos del sistema
 * @returns {Promise<Object>} Nueva estructura de archivos
 */
export const regenerateFileStructure = async () => {
  try {
    const response = await api.post('/file-structure/regenerate');
    return response.data;
  } catch (error) {
    console.error('Error regenerating file structure:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas básicas de la estructura de archivos
 * @returns {Promise<Object>} Estadísticas de estructura de archivos
 */
export const getFileStructureStats = async () => {
  try {
    const response = await api.get('/file-structure/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching file structure stats:', error);
    throw error;
  }
};

/**
 * Obtiene el estado de la estructura de archivos
 * @returns {Promise<Object>} Estado de la estructura de archivos
 */
export const getFileStructureStatus = async () => {
  try {
    const response = await api.get('/file-structure/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching file structure status:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de tipos de archivo
 * @returns {Promise<Object>} Tipos de archivo
 */
export const getFileTypes = async () => {
  try {
    const response = await api.get('/file-structure/file-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching file types:', error);
    throw error;
  }
};

/**
 * Obtiene la estructura de una sección específica
 * @param {string} sectionName - Nombre de la sección
 * @returns {Promise<Object>} Estructura de la sección
 */
export const getFileStructureSection = async (sectionName) => {
  try {
    const response = await api.get(`/file-structure/section/${sectionName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching file structure section ${sectionName}:`, error);
    throw error;
  }
};

/**
 * Hook personalizado para la estructura de archivos
 * Proporciona estado y métodos para manejar la estructura de archivos
 */
export const useFileStructure = () => {
  const [fileStructure, setFileStructure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFileStructure = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFileStructure();
      setFileStructure(response.data);
    } catch (err) {
      setError(err.message || 'Error al cargar la estructura de archivos');
    } finally {
      setLoading(false);
    }
  };

  const regenerateStructure = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await regenerateFileStructure();
      setFileStructure(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al regenerar la estructura de archivos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fileStructure,
    loading,
    error,
    fetchFileStructure,
    regenerateStructure
  };
};

export default {
  getFileStructure,
  regenerateFileStructure,
  getFileStructureStats,
  getFileStructureStatus,
  getFileTypes,
  getFileStructureSection,
  useFileStructure
};
