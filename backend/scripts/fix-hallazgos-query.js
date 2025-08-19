const fs = require('fs');
const path = require('path');

console.log('🔧 AGENTE 1: Corrigiendo consultas de hallazgos...');

const filePath = path.join(__dirname, '../routes/hallazgos.routes.js');

try {
  // Leer el archivo
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('📄 Archivo leído correctamente');
  
  // Contar ocurrencias antes del cambio
  const beforeCount = (content.match(/nombre_completo/g) || []).length;
  console.log(`🔍 Ocurrencias de 'nombre_completo' encontradas: ${beforeCount}`);
  
  // Reemplazar todas las ocurrencias
  const newContent = content.replace(
    /resp\.nombre_completo as responsable_nombre/g,
    "(resp.nombres || ' ' || resp.apellidos) as responsable_nombre"
  ).replace(
    /aud\.nombre_completo as auditor_nombre/g,
    "(aud.nombres || ' ' || aud.apellidos) as auditor_nombre"
  ).replace(
    /per\.nombre_completo/g,
    "(per.nombres || ' ' || per.apellidos)"
  );
  
  // Contar ocurrencias después del cambio
  const afterCount = (newContent.match(/nombre_completo/g) || []).length;
  console.log(`🔍 Ocurrencias restantes: ${afterCount}`);
  
  // Escribir el archivo corregido
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log('✅ Archivo corregido exitosamente');
  console.log(`📊 Cambios realizados: ${beforeCount - afterCount} ocurrencias corregidas`);
  
} catch (error) {
  console.error('❌ Error al corregir archivo:', error.message);
  process.exit(1);
}
