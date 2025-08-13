const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, '../controllers/adminController.js');

try {
  // Leer el archivo
  let content = fs.readFileSync(controllerPath, 'utf8');
  
  // Reemplazar la importación
  content = content.replace(
    "const { tursoClient  } = require('../lib/tursoClient.js');",
    "const { executeQuery } = require('../lib/tursoClient.js');"
  );
  
  // Reemplazar todas las instancias de tursoClient.execute por executeQuery
  content = content.replace(/tursoClient\.execute/g, 'executeQuery');
  
  // Escribir el archivo actualizado
  fs.writeFileSync(controllerPath, content, 'utf8');
  
  console.log('✅ Controlador de administración actualizado correctamente');
  console.log('📝 Cambios realizados:');
  console.log('   - Cambiada importación de tursoClient a executeQuery');
  console.log('   - Reemplazadas todas las llamadas tursoClient.execute por executeQuery');
  
} catch (error) {
  console.error('❌ Error actualizando controlador:', error);
}
