import mongoose from 'mongoose';
import PlantillaRegistro from '../models/PlantillaRegistro';
import Registro from '../models/Registro';

interface IContadorNumeracion {
  organizacion_id: string;
  plantilla_id: string;
  año?: number;
  mes?: number;
  ultimo_numero: number;
}

// Modelo para contadores
const ContadorSchema = new mongoose.Schema({
  organizacion_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  plantilla_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  año: Number,
  mes: Number,
  ultimo_numero: { type: Number, default: 0 }
});

ContadorSchema.index({ organizacion_id: 1, plantilla_id: 1, año: 1, mes: 1 }, { unique: true });

const Contador = mongoose.model('ContadorNumeracion', ContadorSchema);

export class NumeracionService {
  /**
   * Genera un código único para un registro basado en la configuración de la plantilla
   */
  async generarCodigoRegistro(
    plantillaId: string,
    organizacionId: string
  ): Promise<string> {
    const plantilla = await PlantillaRegistro.findById(plantillaId);
    
    if (!plantilla) {
      throw new Error('Plantilla no encontrada');
    }
    
    const config = plantilla.configuracion_avanzada.numeracion_automatica;
    
    if (!config.activa) {
      // Si la numeración automática no está activa, generar código aleatorio
      return this.generarCodigoAleatorio(plantilla.codigo);
    }
    
    // Obtener el siguiente número según la configuración
    const siguienteNumero = await this.obtenerSiguienteNumero(
      plantillaId,
      organizacionId,
      config.reiniciar_anual,
      config.reiniciar_mensual
    );
    
    // Construir el código
    return this.construirCodigo(
      config,
      siguienteNumero,
      plantilla.codigo
    );
  }
  
  /**
   * Obtiene el siguiente número de la secuencia
   */
  private async obtenerSiguienteNumero(
    plantillaId: string,
    organizacionId: string,
    reiniciarAnual: boolean,
    reiniciarMensual: boolean
  ): Promise<number> {
    const ahora = new Date();
    const filtro: any = {
      organizacion_id: organizacionId,
      plantilla_id: plantillaId
    };
    
    if (reiniciarAnual) {
      filtro.año = ahora.getFullYear();
    }
    
    if (reiniciarMensual) {
      filtro.mes = ahora.getMonth() + 1;
    }
    
    // Usar findOneAndUpdate para operación atómica
    const contador = await Contador.findOneAndUpdate(
      filtro,
      { $inc: { ultimo_numero: 1 } },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    
    return contador.ultimo_numero;
  }
  
  /**
   * Construye el código según el formato configurado
   */
  private construirCodigo(
    config: any,
    numero: number,
    codigoPlantilla: string
  ): string {
    const ahora = new Date();
    let codigo = '';
    
    // Si hay formato personalizado, usarlo
    if (config.formato) {
      codigo = config.formato
        .replace('{prefijo}', config.prefijo || codigoPlantilla)
        .replace('{año}', ahora.getFullYear().toString())
        .replace('{año_corto}', (ahora.getFullYear() % 100).toString().padStart(2, '0'))
        .replace('{mes}', (ahora.getMonth() + 1).toString().padStart(2, '0'))
        .replace('{dia}', ahora.getDate().toString().padStart(2, '0'))
        .replace('{numero}', numero.toString().padStart(config.longitud_numero || 4, '0'));
    } else {
      // Formato por defecto
      codigo = config.prefijo || codigoPlantilla;
      
      if (config.reiniciar_anual) {
        codigo += `-${ahora.getFullYear()}`;
      }
      
      if (config.reiniciar_mensual) {
        codigo += `-${(ahora.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      codigo += `-${numero.toString().padStart(config.longitud_numero || 4, '0')}`;
      
      if (config.sufijo) {
        codigo += `-${config.sufijo}`;
      }
    }
    
    return codigo.toUpperCase();
  }
  
  /**
   * Genera un código aleatorio cuando no hay numeración automática
   */
  private generarCodigoAleatorio(prefijo: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefijo}-${timestamp}-${random}`.toUpperCase();
  }
  
  /**
   * Valida si un código ya existe
   */
  async validarCodigoUnico(codigo: string): Promise<boolean> {
    const existe = await Registro.findOne({ codigo });
    return !existe;
  }
  
  /**
   * Reserva un código para uso futuro
   */
  async reservarCodigo(codigo: string, plantillaId: string): Promise<void> {
    // Implementar lógica de reserva si es necesario
    // Por ahora, solo validamos que no exista
    const existe = await this.validarCodigoUnico(codigo);
    
    if (!existe) {
      throw new Error('El código ya está en uso');
    }
  }
  
  /**
   * Reinicia los contadores anuales (ejecutar al inicio del año)
   */
  async reiniciarContadoresAnuales(organizacionId: string): Promise<void> {
    const año = new Date().getFullYear();
    
    // Buscar todas las plantillas con reinicio anual
    const plantillas = await PlantillaRegistro.find({
      organizacion_id: organizacionId,
      'configuracion_avanzada.numeracion_automatica.reiniciar_anual': true
    });
    
    for (const plantilla of plantillas) {
      await Contador.findOneAndUpdate(
        {
          organizacion_id: organizacionId,
          plantilla_id: plantilla._id,
          año
        },
        {
          ultimo_numero: 0
        },
        {
          upsert: true
        }
      );
    }
  }
  
  /**
   * Reinicia los contadores mensuales (ejecutar al inicio del mes)
   */
  async reiniciarContadoresMensuales(organizacionId: string): Promise<void> {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    
    // Buscar todas las plantillas con reinicio mensual
    const plantillas = await PlantillaRegistro.find({
      organizacion_id: organizacionId,
      'configuracion_avanzada.numeracion_automatica.reiniciar_mensual': true
    });
    
    for (const plantilla of plantillas) {
      await Contador.findOneAndUpdate(
        {
          organizacion_id: organizacionId,
          plantilla_id: plantilla._id,
          año,
          mes
        },
        {
          ultimo_numero: 0
        },
        {
          upsert: true
        }
      );
    }
  }
  
  /**
   * Obtiene estadísticas de numeración
   */
  async obtenerEstadisticas(
    plantillaId: string,
    organizacionId: string
  ): Promise<{
    total_registros: number;
    ultimo_numero: number;
    proximo_numero: number;
    formato_ejemplo: string;
  }> {
    const plantilla = await PlantillaRegistro.findById(plantillaId);
    
    if (!plantilla) {
      throw new Error('Plantilla no encontrada');
    }
    
    const config = plantilla.configuracion_avanzada.numeracion_automatica;
    const ahora = new Date();
    
    const filtro: any = {
      organizacion_id: organizacionId,
      plantilla_id: plantillaId
    };
    
    if (config.reiniciar_anual) {
      filtro.año = ahora.getFullYear();
    }
    
    if (config.reiniciar_mensual) {
      filtro.mes = ahora.getMonth() + 1;
    }
    
    const contador = await Contador.findOne(filtro);
    const ultimoNumero = contador?.ultimo_numero || 0;
    const proximoNumero = ultimoNumero + 1;
    
    const totalRegistros = await Registro.countDocuments({
      plantilla_id: plantillaId,
      organizacion_id: organizacionId
    });
    
    const formatoEjemplo = this.construirCodigo(
      config,
      proximoNumero,
      plantilla.codigo
    );
    
    return {
      total_registros: totalRegistros,
      ultimo_numero: ultimoNumero,
      proximo_numero: proximoNumero,
      formato_ejemplo: formatoEjemplo
    };
  }
  
  /**
   * Actualiza la configuración de numeración de una plantilla
   */
  async actualizarConfiguracion(
    plantillaId: string,
    nuevaConfiguracion: any
  ): Promise<void> {
    await PlantillaRegistro.findByIdAndUpdate(
      plantillaId,
      {
        'configuracion_avanzada.numeracion_automatica': nuevaConfiguracion
      }
    );
    
    // Si se cambió a reinicio anual o mensual, crear contador inicial
    if (nuevaConfiguracion.reiniciar_anual || nuevaConfiguracion.reiniciar_mensual) {
      const plantilla = await PlantillaRegistro.findById(plantillaId);
      
      if (plantilla) {
        const ahora = new Date();
        const filtro: any = {
          organizacion_id: plantilla.organizacion_id,
          plantilla_id: plantillaId
        };
        
        if (nuevaConfiguracion.reiniciar_anual) {
          filtro.año = ahora.getFullYear();
        }
        
        if (nuevaConfiguracion.reiniciar_mensual) {
          filtro.mes = ahora.getMonth() + 1;
        }
        
        await Contador.findOneAndUpdate(
          filtro,
          { $setOnInsert: { ultimo_numero: 0 } },
          { upsert: true }
        );
      }
    }
  }
  
  /**
   * Corrige la numeración en caso de inconsistencias
   */
  async corregirNumeracion(
    plantillaId: string,
    organizacionId: string
  ): Promise<void> {
    // Obtener todos los registros de la plantilla ordenados por fecha
    const registros = await Registro.find({
      plantilla_id: plantillaId,
      organizacion_id: organizacionId
    }).sort({ 'metadata.fecha_creacion': 1 });
    
    const plantilla = await PlantillaRegistro.findById(plantillaId);
    
    if (!plantilla) {
      throw new Error('Plantilla no encontrada');
    }
    
    const config = plantilla.configuracion_avanzada.numeracion_automatica;
    
    // Agrupar por año/mes si es necesario
    const grupos = new Map<string, any[]>();
    
    for (const registro of registros) {
      const fecha = registro.metadata.fecha_creacion;
      let clave = 'general';
      
      if (config.reiniciar_anual) {
        clave = fecha.getFullYear().toString();
      }
      
      if (config.reiniciar_mensual) {
        clave += `-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (!grupos.has(clave)) {
        grupos.set(clave, []);
      }
      
      grupos.get(clave)?.push(registro);
    }
    
    // Renumerar cada grupo
    for (const [clave, registrosGrupo] of grupos) {
      let numero = 1;
      
      for (const registro of registrosGrupo) {
        const nuevoCodigo = this.construirCodigo(
          config,
          numero,
          plantilla.codigo
        );
        
        // Actualizar el código del registro
        await Registro.findByIdAndUpdate(
          registro._id,
          { codigo: nuevoCodigo }
        );
        
        numero++;
      }
      
      // Actualizar el contador
      const [año, mes] = clave.split('-').map(Number);
      const filtro: any = {
        organizacion_id: organizacionId,
        plantilla_id: plantillaId
      };
      
      if (config.reiniciar_anual && año) {
        filtro.año = año;
      }
      
      if (config.reiniciar_mensual && mes) {
        filtro.mes = mes;
      }
      
      await Contador.findOneAndUpdate(
        filtro,
        { ultimo_numero: numero - 1 },
        { upsert: true }
      );
    }
  }
}

// Exportar instancia singleton
export default new NumeracionService();