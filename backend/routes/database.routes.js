const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { DatabaseSchemaUpdater } = require('../scripts/database-schema-updater');

// Ruta para obtener el esquema de la base de datos
router.get('/schema', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'database-schema.json');
    
    if (fs.existsSync(schemaPath)) {
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      res.json(schemaData);
    } else {
      // Si no existe el archivo, generar uno nuevo
      const updater = new DatabaseSchemaUpdater();
      const schemaData = await updater.updateDocumentation();
      res.json(schemaData);
    }
  } catch (error) {
    console.error('Error obteniendo esquema:', error);
    res.status(500).json({ 
      error: 'Error obteniendo esquema de base de datos',
      message: error.message 
    });
  }
});

// Ruta para actualizar el esquema manualmente
router.post('/schema/update', async (req, res) => {
  try {
    const updater = new DatabaseSchemaUpdater();
    const schemaData = await updater.updateDocumentation();
    
    res.json({
      success: true,
      message: 'Esquema actualizado exitosamente',
      data: {
        lastUpdate: schemaData.lastUpdate,
        totalTables: schemaData.totalTables,
        executionTime: Date.now() - new Date(schemaData.lastUpdate).getTime()
      }
    });
  } catch (error) {
    console.error('Error actualizando esquema:', error);
    res.status(500).json({ 
      error: 'Error actualizando esquema de base de datos',
      message: error.message 
    });
  }
});

// Ruta para obtener el estado del actualizador
router.get('/schema/status', async (req, res) => {
  try {
    const updater = new DatabaseSchemaUpdater();
    const status = updater.getStatus();
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error obteniendo estado:', error);
    res.status(500).json({ 
      error: 'Error obteniendo estado del actualizador',
      message: error.message 
    });
  }
});

// Ruta para obtener estadísticas de la base de datos
router.get('/stats', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'database-schema.json');
    
    if (fs.existsSync(schemaPath)) {
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      
      const stats = {
        totalTables: schemaData.totalTables,
        totalColumns: Object.values(schemaData.tables).reduce((sum, table) => sum + table.columns.length, 0),
        totalRelations: Object.values(schemaData.tables).reduce((sum, table) => sum + table.relations.length, 0),
        totalRecords: Object.values(schemaData.tables).reduce((sum, table) => sum + table.recordCount, 0),
        lastUpdate: schemaData.lastUpdate,
        tableCategories: {
          'Organizaciones y Usuarios': ['organizations', 'users', 'organization_features', 'user_feature_permissions'],
          'Gestión de Personal': ['personal', 'departamentos', 'puestos', 'competencias', 'evaluaciones'],
          'Sistema SGC': ['sgc_personal_relaciones', 'sgc_documentos_relacionados', 'sgc_normas_relacionadas'],
          'Procesos y Documentos': ['procesos', 'documentos', 'normas'],
          'Auditorías y Calidad': ['auditorias', 'hallazgos', 'acciones'],
          'Indicadores y Objetivos': ['indicadores', 'mediciones', 'objetivos_calidad'],
          'Comunicación': ['minutas', 'minutas_participantes', 'minutas_documentos'],
          'Capacitación': ['capacitaciones', 'capacitaciones_personal'],
          'Productos': ['productos']
        }
      };
      
      // Calcular estadísticas por categoría
      stats.categoryStats = {};
      for (const [category, tableNames] of Object.entries(stats.tableCategories)) {
        const categoryTables = tableNames.filter(name => schemaData.tables[name]);
        stats.categoryStats[category] = {
          tableCount: categoryTables.length,
          totalRecords: categoryTables.reduce((sum, tableName) => sum + schemaData.tables[tableName].recordCount, 0),
          totalColumns: categoryTables.reduce((sum, tableName) => sum + schemaData.tables[tableName].columns.length, 0)
        };
      }
      
      res.json({
        success: true,
        stats
      });
    } else {
      res.status(404).json({ 
        error: 'Archivo de esquema no encontrado',
        message: 'Ejecuta una actualización del esquema primero' 
      });
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      error: 'Error obteniendo estadísticas de base de datos',
      message: error.message 
    });
  }
});

// Ruta para obtener información detallada de una tabla específica
router.get('/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const schemaPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'database-schema.json');
    
    if (fs.existsSync(schemaPath)) {
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      
      if (schemaData.tables[tableName]) {
        res.json({
          success: true,
          table: {
            name: tableName,
            ...schemaData.tables[tableName]
          }
        });
      } else {
        res.status(404).json({ 
          error: 'Tabla no encontrada',
          message: `La tabla '${tableName}' no existe en el esquema` 
        });
      }
    } else {
      res.status(404).json({ 
        error: 'Archivo de esquema no encontrado',
        message: 'Ejecuta una actualización del esquema primero' 
      });
    }
  } catch (error) {
    console.error('Error obteniendo información de tabla:', error);
    res.status(500).json({ 
      error: 'Error obteniendo información de tabla',
      message: error.message 
    });
  }
});

// Ruta para buscar tablas y campos
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // Término de búsqueda
    
    if (!q) {
      return res.status(400).json({ 
        error: 'Término de búsqueda requerido',
        message: 'Proporciona un parámetro "q" para buscar' 
      });
    }
    
    const schemaPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'database-schema.json');
    
    if (fs.existsSync(schemaPath)) {
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      const searchTerm = q.toLowerCase();
      
      const results = {
        tables: [],
        columns: [],
        totalResults: 0
      };
      
      // Buscar en tablas
      for (const [tableName, table] of Object.entries(schemaData.tables)) {
        if (tableName.toLowerCase().includes(searchTerm)) {
          results.tables.push({
            name: tableName,
            recordCount: table.recordCount,
            columnCount: table.columns.length
          });
        }
        
        // Buscar en columnas
        for (const column of table.columns) {
          if (column.name.toLowerCase().includes(searchTerm)) {
            results.columns.push({
              tableName,
              columnName: column.name,
              type: column.type,
              isPrimary: column.primaryKey,
              isRequired: column.notNull
            });
          }
        }
      }
      
      results.totalResults = results.tables.length + results.columns.length;
      
      res.json({
        success: true,
        searchTerm: q,
        results
      });
    } else {
      res.status(404).json({ 
        error: 'Archivo de esquema no encontrado',
        message: 'Ejecuta una actualización del esquema primero' 
      });
    }
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ 
      error: 'Error realizando búsqueda',
      message: error.message 
    });
  }
});

module.exports = router;
