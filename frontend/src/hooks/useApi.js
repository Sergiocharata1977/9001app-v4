import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';

/**
 * @hook useApi
 * @description Hook personalizado para manejo de llamadas API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones adicionales
 * @returns {Object} Estado y funciones de la API
 */
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(endpoint, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const post = useCallback(async (body = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post(endpoint, body);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const put = useCallback(async (body = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.put(endpoint, body);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const del = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.delete(endpoint);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    execute,
    post,
    put,
    delete: del
  };
}; 