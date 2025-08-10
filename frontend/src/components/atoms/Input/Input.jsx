import React from 'react';
import { cn } from '../../../utils/helpers';

/**
 * @component Input
 * @description Componente atómico de input reutilizable
 * @param {Object} props - Props del componente
 * @param {string} props.type - Tipo de input (text, email, password, etc.)
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.value - Valor del input
 * @param {Function} props.onChange - Función de cambio
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element} Componente Input
 */
export const Input = React.memo(({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input'; 