const fs = require('fs');
const path = require('path');

async function generarMapaArchivos() {
  console.log('🗂️ Generando mapa de archivos del sistema...\n');
  
  const mapa = {
    frontend: {},
    backend: {},
    docs: {},
    timestamp: new Date().toISOString()
  };

  // Mapear frontend
  const frontendPath = path.join(__dirname, '../../../frontend/src');
  mapa.frontend = await mapearDirectorio(frontendPath, 'frontend/src');

  // Mapear backend
  const backendPath = path.join(__dirname, '../../');
  mapa.backend = await mapearDirectorio(backendPath, 'backend');

  // Mapear docs
  const docsPath = path.join(__dirname, '../../../docs-esenciales');
  mapa.docs = await mapearDirectorio(docsPath, 'docs-esenciales');

  // Guardar mapa
  const outputPath = path.join(__dirname, '../../../docs-esenciales/02-mapa-archivos-automatico.md');
  const contenido = generarMarkdown(mapa);
  
  fs.writeFileSync(outputPath, contenido);
  console.log(`✅ Mapa generado: ${outputPath}`);
  
  return mapa;
}

async function mapearDirectorio(dirPath, nombreRelativo) {
  const estructura = {};
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Ignorar node_modules y otros directorios innecesarios
        if (!['node_modules', '.git', 'dist', 'build', 'coverage'].includes(item)) {
          estructura[item] = await mapearDirectorio(itemPath, `${nombreRelativo}/${item}`);
        }
      } else {
        // Solo archivos importantes
        const extension = path.extname(item);
        if (['.js', '.jsx', '.ts', '.tsx', '.md', '.json', '.sql'].includes(extension)) {
          estructura[item] = {
            tipo: 'archivo',
            extension,
            ruta: `${nombreRelativo}/${item}`,
            tamaño: stat.size,
            modificado: stat.mtime.toISOString()
          };
        }
      }
    }
  } catch (error) {
    console.error(`Error mapeando ${dirPath}:`, error.message);
  }
  
  return estructura;
}

function generarMarkdown(mapa) {
  let contenido = `# 🗂️ MAPA DE ARCHIVOS - SISTEMA SGC
**📅 Generado automáticamente: ${new Date().toLocaleString('es-ES')}**

## 📊 **ESTADÍSTICAS RÁPIDAS**
- **Total Archivos Frontend:** ${contarArchivos(mapa.frontend)}
- **Total Archivos Backend:** ${contarArchivos(mapa.backend)}
- **Total Documentos:** ${contarArchivos(mapa.docs)}

## 🎨 **FRONTEND** (React + Vite)

### 📁 **Componentes Principales**
${generarSeccionArchivos(mapa.frontend.components, 'components')}

### 📁 **Páginas**
${generarSeccionArchivos(mapa.frontend.pages, 'pages')}

### 📁 **Servicios**
${generarSeccionArchivos(mapa.frontend.services, 'services')}

### 📁 **Rutas**
${generarSeccionArchivos(mapa.frontend.routes, 'routes')}

## ⚙️ **BACKEND** (Node.js + Express)

### 📁 **Controladores**
${generarSeccionArchivos(mapa.backend.controllers, 'controllers')}

### 📁 **Rutas**
${generarSeccionArchivos(mapa.backend.routes, 'routes')}

### 📁 **Servicios**
${generarSeccionArchivos(mapa.backend.services, 'services')}

### 📁 **Middleware**
${generarSeccionArchivos(mapa.backend.middleware, 'middleware')}

### 📁 **Scripts**
${generarSeccionArchivos(mapa.backend.scripts, 'scripts')}

## 📚 **DOCUMENTACIÓN**
${generarSeccionArchivos(mapa.docs, 'docs-esenciales')}

## 🔍 **ARCHIVOS CRÍTICOS**
- **Configuración:** \`frontend/src/config/\`, \`backend/config/\`
- **Base de Datos:** \`backend/lib/mongoClient.js\`
- **Rutas Principales:** \`frontend/src/routes/AppRoutes.jsx\`
- **Menús:** \`frontend/src/components/menu/MainMenuCards.jsx\`
- **Autenticación:** \`backend/middleware/authMiddleware.js\`

## 📝 **NOTAS PARA IA**
- Los archivos más importantes están en \`components/\`, \`pages/\`, \`controllers/\`
- La estructura sigue patrones React + Express estándar
- Base de datos: Turso (SQLite) con 35+ tablas
- Sistema RAG implementado en \`backend/RAG-System/\`
`;

  return contenido;
}

function generarSeccionArchivos(seccion, nombreSeccion) {
  if (!seccion || Object.keys(seccion).length === 0) {
    return `- *No hay archivos en ${nombreSeccion}*`;
  }

  let contenido = '';
  for (const [nombre, info] of Object.entries(seccion)) {
    if (info.tipo === 'archivo') {
      contenido += `- **${nombre}** (\`${info.ruta}\`)\n`;
    } else {
      contenido += `- **📁 ${nombre}/**\n`;
      for (const [subNombre, subInfo] of Object.entries(info)) {
        if (subInfo.tipo === 'archivo') {
          contenido += `  - ${subNombre} (\`${subInfo.ruta}\`)\n`;
        }
      }
    }
  }
  
  return contenido || `- *No hay archivos en ${nombreSeccion}*`;
}

function contarArchivos(estructura) {
  let contador = 0;
  
  function contar(seccion) {
    for (const [nombre, info] of Object.entries(seccion)) {
      if (info.tipo === 'archivo') {
        contador++;
      } else {
        contar(info);
      }
    }
  }
  
  contar(estructura);
  return contador;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generarMapaArchivos();
}

module.exports = { generarMapaArchivos };
