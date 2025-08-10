import React from 'react';
import { Input } from '../../atoms/Input';

/**
 * @component FormField
 * @description Componente molecular de campo de formulario
 * @param {Object} props - Props del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {string} props.type - Tipo de input
 * @param {string} props.value - Valor del campo
 * @param {Function} props.onChange - Función de cambio
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.required - Campo requerido
 * @returns {JSX.Element} Componente FormField
 */
export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  className,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'border-red-500' : ''}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}; 