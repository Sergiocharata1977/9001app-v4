import React from 'react';
import { cn } from '../../../utils/helpers';

/**
 * @component Card
 * @description Componente atómico de tarjeta reutilizable
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element} Componente Card
 */
export const Card = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * @component CardHeader
 * @description Header de la tarjeta
 */
export const CardHeader = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * @component CardTitle
 * @description Título de la tarjeta
 */
export const CardTitle = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

/**
 * @component CardDescription
 * @description Descripción de la tarjeta
 */
export const CardDescription = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
});

/**
 * @component CardContent
 * @description Contenido de la tarjeta
 */
export const CardContent = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
});

/**
 * @component CardFooter
 * @description Footer de la tarjeta
 */
export const CardFooter = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter'; 