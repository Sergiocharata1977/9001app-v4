import { Request, Response } from 'express';
import NumeracionCorrelativaService, { IConfiguracionNumeracion } from '../services/NumeracionCorrelativaService';

export class NumeracionCorrelativaController {
  
  /**
   * Genera un código correlativo ISO 9001
   * POST /api/numeracion-correlativa/generar
   */
  async generarCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { tipo_entidad, prefijo, formato, reiniciar_anual, reiniciar_mensual, configuracion_avanzada } = req.body;
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      if (!tipo_entidad || !prefijo) {
        res.status(400).json({
          success: false,
          message: 'Los campos tipo_entidad y prefijo son obligatorios'
        });
        return;
      }
      
      const configuracion: IConfiguracionNumeracion = {
        tipo_entidad,
        prefijo,
        formato,
        reiniciar_anual,
        reiniciar_mensual,
        configuracion_avanzada
      };
      
      const resultado = await NumeracionCorrelativaService.generarCodigo(
        organizationId,
        configuracion,
        req.user?.id
      );
      
      console.log(`✅ Código generado: ${resultado.codigo} para ${tipo_entidad}`);
      
      res.status(201).json({
        success: true,
        data: resultado,
        message: 'Código correlativo generado exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error generando código correlativo:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al generar código correlativo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Genera un código de sub-numeración
   * POST /api/numeracion-correlativa/sub-codigo
   */
  async generarSubCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo_padre, tipo_sub_entidad, prefijo } = req.body;
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      if (!codigo_padre || !tipo_sub_entidad || !prefijo) {
        res.status(400).json({
          success: false,
          message: 'Los campos codigo_padre, tipo_sub_entidad y prefijo son obligatorios'
        });
        return;
      }
      
      const codigo = await NumeracionCorrelativaService.generarSubCodigo(
        organizationId,
        codigo_padre,
        tipo_sub_entidad,
        prefijo
      );
      
      console.log(`✅ Sub-código generado: ${codigo}`);
      
      res.status(201).json({
        success: true,
        data: { codigo },
        message: 'Sub-código generado exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error generando sub-código:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al generar sub-código',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Genera un código completo de flujo ISO 9001
   * POST /api/numeracion-correlativa/flujo-completo
   */
  async generarCodigoFlujoCompleto(req: Request, res: Response): Promise<void> {
    try {
      const { tipo_flujo } = req.body;
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      if (!tipo_flujo) {
        res.status(400).json({
          success: false,
          message: 'El campo tipo_flujo es obligatorio'
        });
        return;
      }
      
      const resultado = await NumeracionCorrelativaService.generarCodigoFlujoCompleto(
        organizationId,
        tipo_flujo
      );
      
      console.log(`✅ Código de flujo generado: ${JSON.stringify(resultado)}`);
      
      res.status(201).json({
        success: true,
        data: resultado,
        message: 'Código de flujo generado exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error generando código de flujo:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al generar código de flujo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Obtiene la configuración de numeración
   * GET /api/numeracion-correlativa/configuracion
   */
  async obtenerConfiguracion(req: Request, res: Response): Promise<void> {
    try {
      const { tipo_entidad } = req.query;
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      const configuraciones = await NumeracionCorrelativaService.obtenerConfiguracion(
        organizationId,
        tipo_entidad as string
      );
      
      console.log(`✅ ${configuraciones.length} configuraciones encontradas`);
      
      res.json({
        success: true,
        data: configuraciones,
        total: configuraciones.length
      });
      
    } catch (error) {
      console.error('❌ Error obteniendo configuración:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al obtener configuración',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Genera un código de ejemplo para mostrar el formato
   * GET /api/numeracion-correlativa/ejemplo/:tipo
   */
  async generarCodigoEjemplo(req: Request, res: Response): Promise<void> {
    try {
      const { tipo } = req.params;
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      let configuracion: IConfiguracionNumeracion;
      
      switch (tipo) {
        case 'reunion':
          configuracion = {
            tipo_entidad: 'reunion',
            prefijo: 'REV',
            formato: 'REV-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          break;
          
        case 'auditoria':
          configuracion = {
            tipo_entidad: 'auditoria',
            prefijo: 'AUD',
            formato: 'AUD-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          break;
          
        case 'hallazgo':
          configuracion = {
            tipo_entidad: 'hallazgo',
            prefijo: 'HAL',
            formato: 'HAL-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          break;
          
        case 'accion':
          configuracion = {
            tipo_entidad: 'accion',
            prefijo: 'ACC',
            formato: 'ACC-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          break;
          
        default:
          res.status(400).json({
            success: false,
            message: 'Tipo de entidad no válido. Tipos disponibles: reunion, auditoria, hallazgo, accion'
          });
          return;
      }
      
      const resultado = await NumeracionCorrelativaService.generarCodigo(
        organizationId,
        configuracion,
        req.user?.id
      );
      
      console.log(`✅ Código de ejemplo generado: ${resultado.codigo}`);
      
      res.json({
        success: true,
        data: {
          codigo_ejemplo: resultado.codigo,
          proximo_codigo: resultado.proximo_codigo,
          configuracion: configuracion
        },
        message: 'Código de ejemplo generado exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error generando código de ejemplo:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al generar código de ejemplo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Obtiene estadísticas de numeración
   * GET /api/numeracion-correlativa/estadisticas
   */
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      const estadisticas = await NumeracionCorrelativaService.obtenerEstadisticas(organizationId);
      
      console.log(`✅ Estadísticas obtenidas para organización ${organizationId}`);
      
      res.json({
        success: true,
        data: estadisticas
      });
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Reinicia los contadores anuales
   * POST /api/numeracion-correlativa/reiniciar-anual
   */
  async reiniciarContadoresAnuales(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      const resultado = await NumeracionCorrelativaService.reiniciarContadoresAnuales(organizationId);
      
      console.log(`✅ Contadores anuales reiniciados: ${resultado.contadores_reiniciados} de ${resultado.configuraciones_afectadas}`);
      
      res.json({
        success: true,
        data: resultado,
        message: 'Contadores anuales reiniciados exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error reiniciando contadores anuales:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al reiniciar contadores anuales',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  
  /**
   * Reinicia los contadores mensuales
   * POST /api/numeracion-correlativa/reiniciar-mensual
   */
  async reiniciarContadoresMensuales(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.user?.organization_id;
      
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'Organización no identificada'
        });
        return;
      }
      
      const resultado = await NumeracionCorrelativaService.reiniciarContadoresMensuales(organizationId);
      
      console.log(`✅ Contadores mensuales reiniciados: ${resultado.contadores_reiniciados} de ${resultado.configuraciones_afectadas}`);
      
      res.json({
        success: true,
        data: resultado,
        message: 'Contadores mensuales reiniciados exitosamente'
      });
      
    } catch (error) {
      console.error('❌ Error reiniciando contadores mensuales:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al reiniciar contadores mensuales',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export default new NumeracionCorrelativaController();
