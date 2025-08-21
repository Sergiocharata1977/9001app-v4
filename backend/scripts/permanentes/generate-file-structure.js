const fs = require('fs');
const path = require('path');

/**
 * Script para generar la estructura de archivos del sistema en formato JSON
 * Este script analiza la estructura completa del proyecto y genera un reporte
 * que puede ser consumido por el frontend para mostrar la estructura de archivos
 */

// Configuración
const ROOT_DIR = path.join(__dirname, '../../..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'logs/file-structure.json');
const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'logs',
  '*.log',
  '*.tmp',
  '*.cache',
  '.DS_Store',
  'Thumbs.db',
  '.env',
  '.env.local',
  '.env.production'
];

// Función para contar líneas de un archivo
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

// Función para obtener estadísticas de un archivo
function getFileStats(filePath) {
  const stats = fs.statSync(filePath);
  const lines = countLines(filePath);
  return {
    size: stats.size,
    lines: lines,
    modified: stats.mtime.toISOString(),
    created: stats.birthtime.toISOString()
  };
}

// Función para verificar si un archivo debe ser ignorado
function shouldIgnore(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  return IGNORED_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(relativePath);
    }
    return relativePath.includes(pattern);
  });
}

// Función para obtener la extensión de un archivo
function getFileExtension(filePath) {
  const ext = path.extname(filePath);
  return ext || '.unknown';
}

// Función para analizar un directorio recursivamente
function analyzeDirectory(dirPath, relativePath = '') {
  const result = {
    type: 'directory',
    name: path.basename(dirPath),
    path: relativePath,
    files: 0,
    lines: 0,
    size: 0,
    children: {},
    fileTypes: {},
    status: '✅ Existe'
  };

  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      
      if (shouldIgnore(fullPath)) {
        continue;
      }

      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        const childResult = analyzeDirectory(fullPath, itemRelativePath);
        result.children[item] = childResult;
        result.files += childResult.files;
        result.lines += childResult.lines;
        result.size += childResult.size;
        
        // Merge file types
        Object.entries(childResult.fileTypes).forEach(([ext, count]) => {
          result.fileTypes[ext] = (result.fileTypes[ext] || 0) + count;
        });
      } else {
        const fileStats = getFileStats(fullPath);
        const ext = getFileExtension(item);
        
        result.children[item] = {
          type: 'file',
          name: item,
          path: itemRelativePath,
          extension: ext,
          ...fileStats,
          status: '✅ Existe'
        };
        
        result.files++;
        result.lines += fileStats.lines;
        result.size += fileStats.size;
        result.fileTypes[ext] = (result.fileTypes[ext] || 0) + 1;
      }
    }
  } catch (error) {
    result.status = '❌ Error';
    console.error(`Error analyzing directory ${dirPath}:`, error.message);
  }

  return result;
}

// Función para generar estadísticas generales
function generateGeneralStats(structure) {
  const stats = {
    totalFiles: 0,
    totalLines: 0,
    totalSize: 0,
    fileTypes: {},
    directories: 0,
    lastUpdate: new Date().toISOString()
  };

  function traverse(node) {
    if (node.type === 'directory') {
      stats.directories++;
      Object.values(node.children).forEach(traverse);
    } else {
      stats.totalFiles++;
      stats.totalLines += node.lines;
      stats.totalSize += node.size;
      stats.fileTypes[node.extension] = (stats.fileTypes[node.extension] || 0) + 1;
    }
  }

  traverse(structure);
  return stats;
}

// Función para organizar por secciones
function organizeBySections(structure) {
  const sections = {
    backend: {
      name: 'Backend',
      icon: '🏗️',
      files: 0,
      lines: 0,
      status: '✅ Activo',
      structure: {}
    },
    frontend: {
      name: 'Frontend',
      icon: '🎨',
      files: 0,
      lines: 0,
      status: '✅ Activo',
      structure: {}
    },
    documentation: {
      name: 'Documentación',
      icon: '📚',
      files: 0,
      lines: 0,
      status: '✅ Activo',
      structure: {}
    },
    scripts: {
      name: 'Scripts',
      icon: '⚙️',
      files: 0,
      lines: 0,
      status: '✅ Activo',
      structure: {}
    }
  };

  // Organizar por secciones
  Object.entries(structure.children).forEach(([name, node]) => {
    if (name === 'backend') {
      sections.backend.structure = node.children;
      sections.backend.files = node.files;
      sections.backend.lines = node.lines;
    } else if (name === 'frontend') {
      sections.frontend.structure = node.children;
      sections.frontend.files = node.files;
      sections.frontend.lines = node.lines;
    } else if (name === 'docs-esenciales') {
      sections.documentation.structure = { [name]: node };
      sections.documentation.files = node.files;
      sections.documentation.lines = node.lines;
    } else if (name === 'scripts' || name === 'control-continuo.ps1' || name === 'deploy-quick.bat' || name === 'deploy-server.sh') {
      sections.scripts.structure[name] = node;
      sections.scripts.files += node.files || 1;
      sections.scripts.lines += node.lines || 0;
    }
  });

  return sections;
}

// Función principal
function generateFileStructure() {
  console.log('🔍 Analizando estructura de archivos...');
  
  try {
    // Crear directorio de logs si no existe
    const logsDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Analizar estructura completa
    const structure = analyzeDirectory(ROOT_DIR);
    
    // Generar estadísticas generales
    const generalStats = generateGeneralStats(structure);
    
    // Organizar por secciones
    const sections = organizeBySections(structure);
    
    // Preparar datos para el frontend
    const fileStructureData = {
      lastUpdate: new Date().toLocaleString('es-ES'),
      totalFiles: generalStats.totalFiles,
      totalLines: generalStats.totalLines,
      totalSize: generalStats.totalSize,
      status: 'Activo y Monitoreado',
      sections: sections,
      fileTypes: Object.entries(generalStats.fileTypes)
        .map(([extension, count]) => ({
          extension,
          count,
          percentage: ((count / generalStats.totalFiles) * 100).toFixed(1),
          status: extension === '.unknown' || extension === '.backup' || extension === '.bak' 
            ? '⚠️ Revisar' 
            : '✅ Activo'
        }))
        .sort((a, b) => b.count - a.count),
      directories: generalStats.directories,
      generalStats: generalStats
    };

    // Guardar en archivo JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fileStructureData, null, 2));
    
    console.log('✅ Estructura de archivos generada exitosamente');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Total de archivos: ${generalStats.totalFiles.toLocaleString()}`);
    console.log(`   - Total de líneas: ${generalStats.totalLines.toLocaleString()}`);
    console.log(`   - Total de directorios: ${generalStats.directories.toLocaleString()}`);
    console.log(`   - Tamaño total: ${(generalStats.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 Archivo generado: ${OUTPUT_FILE}`);
    
    return fileStructureData;
    
  } catch (error) {
    console.error('❌ Error generando estructura de archivos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateFileStructure();
}

module.exports = { generateFileStructure };
