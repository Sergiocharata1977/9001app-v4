import { useCallback, useState } from 'react';
import numeracionCorrelativaService, { ICodigoGenerado, IConfiguracionNumeracion } from '../services/numeracionCorrelativaService';

export interface IUseNumeracionCorrelativa {
  // Estados
  loading: boolean;
  error: string | null;
  success: string | null;
  codigoGenerado: ICodigoGenerado | null;
  
  // Funciones
  generarCodigo: (configuracion: IConfiguracionNumeracion) => Promise<void>;
  generarSubCodigo: (codigoPadre: string, tipoSubEntidad: 'hallazgo' | 'accion', prefijo: string) => Promise<string>;
  generarCodigoFlujoCompleto: (tipoFlujo: 'reunion_direccion' | 'auditoria_interna' | 'accion_correctiva') => Promise<any>;
  generarEjemplo: (tipo: string) => Promise<void>;
  limpiarEstados: () => void;
  copiarCodigo: (codigo: string) => Promise<boolean>;
}

export const useNumeracionCorrelativa = (): IUseNumeracionCorrelativa => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [codigoGenerado, setCodigoGenerado] = useState<ICodigoGenerado | null>(null);

  // Generar código correlativo
  const generarCodigo = useCallback(async (configuracion: IConfiguracionNumeracion) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const resultado = await numeracionCorrelativaService.generarCodigo(configuracion);
      setCodigoGenerado(resultado);
      setSuccess('Código generado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar código';
      setError(errorMessage);
      console.error('Error generando código:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar sub-código
  const generarSubCodigo = useCallback(async (
    codigoPadre: string,
    tipoSubEntidad: 'hallazgo' | 'accion',
    prefijo: string
  ): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await numeracionCorrelativaService.generarSubCodigo(
        codigoPadre,
        tipoSubEntidad,
        prefijo
      );
      setSuccess('Sub-código generado exitosamente');
      return resultado.codigo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar sub-código';
      setError(errorMessage);
      console.error('Error generando sub-código:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar código de flujo completo
  const generarCodigoFlujoCompleto = useCallback(async (
    tipoFlujo: 'reunion_direccion' | 'auditoria_interna' | 'accion_correctiva'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await numeracionCorrelativaService.generarCodigoFlujoCompleto(tipoFlujo);
      setSuccess('Código de flujo generado exitosamente');
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar código de flujo';
      setError(errorMessage);
      console.error('Error generando código de flujo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar código de ejemplo
  const generarEjemplo = useCallback(async (tipo: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await numeracionCorrelativaService.generarCodigoEjemplo(tipo);
      setCodigoGenerado({
        codigo: resultado.codigo_ejemplo,
        numero: 1,
        proximo_codigo: resultado.proximo_codigo
      });
      setSuccess(`Código de ejemplo generado para ${tipo}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar ejemplo';
      setError(errorMessage);
      console.error('Error generando ejemplo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar estados
  const limpiarEstados = useCallback(() => {
    setError(null);
    setSuccess(null);
    setCodigoGenerado(null);
  }, []);

  // Copiar código al portapapeles
  const copiarCodigo = useCallback(async (codigo: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(codigo);
      setSuccess('Código copiado al portapapeles');
      return true;
    } catch (err) {
      setError('Error al copiar código');
      console.error('Error copiando código:', err);
      return false;
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    success,
    codigoGenerado,
    
    // Funciones
    generarCodigo,
    generarSubCodigo,
    generarCodigoFlujoCompleto,
    generarEjemplo,
    limpiarEstados,
    copiarCodigo
  };
};
