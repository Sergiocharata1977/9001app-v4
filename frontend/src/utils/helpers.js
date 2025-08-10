import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Función para combinar clases CSS de manera inteligente
 * @param {...string} inputs - Clases CSS a combinar
 * @returns {string} Clases CSS combinadas
 */
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

/**
 * Función para formatear fechas
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

/**
 * Función para capitalizar texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Función para truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Función para generar ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Función para validar email
 * @param {string} email - Email a validar
 * @returns {boolean} Es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Función para limpiar objeto de valores nulos/undefined
 * @param {Object} obj - Objeto a limpiar
 * @returns {Object} Objeto limpio
 */
export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null)
  );
}; 