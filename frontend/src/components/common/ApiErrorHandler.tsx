import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from 'react';

export interface ApiErrorHandlerProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    isLoading?: boolean;
}

/**
 * Componente para manejar errores de API de manera consistente
 */
const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({
    title = "Error de conexión",
    message = "No se pudo conectar con el servidor. Por favor, verifica que el backend esté en ejecución.",
    onRetry,
    isLoading = false
}) => {
    return (
        <div className="p-4 max-w-3xl mx-auto">
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    disabled={isLoading}
                    variant="outline"
                    className="mt-2"
                >
                    {isLoading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Cargando...
                        </>
                    ) : (
                        'Reintentar'
                    )}
                </Button>
            )}
        </div>
    );
};

export default ApiErrorHandler;
