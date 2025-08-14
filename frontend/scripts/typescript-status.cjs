#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function print(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader() {
  console.log('\n' + '='.repeat(80));
  print(colors.bright + colors.cyan, '🚀 REPORTE DE ESTADO TYPESCRIPT - ISO 9001 APP');
  console.log('='.repeat(80));
}

function printSection(title) {
  console.log('\n' + '-'.repeat(60));
  print(colors.bright + colors.blue, title);
  console.log('-'.repeat(60));
}

function countFiles(dir, extension) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        count += countFiles(fullPath, extension);
      } else if (file.name.endsWith(extension)) {
        count++;
      }
    }
    
    return count;
  } catch (error) {
    return 0;
  }
}

function checkTypeScriptConfig() {
  printSection('📋 CONFIGURACIÓN TYPESCRIPT');
  
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsconfigNodePath = path.join(process.cwd(), 'tsconfig.node.json');
  
  if (fs.existsSync(tsconfigPath)) {
    print(colors.green, '✅ tsconfig.json encontrado');
    try {
      const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      print(colors.white, `   - Target: ${config.compilerOptions?.target || 'No especificado'}`);
      print(colors.white, `   - Strict: ${config.compilerOptions?.strict || false}`);
      print(colors.white, `   - JSX: ${config.compilerOptions?.jsx || 'No especificado'}`);
    } catch (error) {
      print(colors.red, '❌ Error al leer tsconfig.json');
    }
  } else {
    print(colors.red, '❌ tsconfig.json no encontrado');
  }
  
  if (fs.existsSync(tsconfigNodePath)) {
    print(colors.green, '✅ tsconfig.node.json encontrado');
  } else {
    print(colors.yellow, '⚠️  tsconfig.node.json no encontrado');
  }
}

function checkPackageJson() {
  printSection('📦 DEPENDENCIAS TYPESCRIPT');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Verificar TypeScript
      if (pkg.devDependencies?.typescript) {
        print(colors.green, `✅ TypeScript ${pkg.devDependencies.typescript} instalado`);
      } else {
        print(colors.red, '❌ TypeScript no instalado');
      }
      
      // Verificar tipos de React
      if (pkg.devDependencies?.['@types/react']) {
        print(colors.green, `✅ @types/react ${pkg.devDependencies['@types/react']} instalado`);
      } else {
        print(colors.red, '❌ @types/react no instalado');
      }
      
      if (pkg.devDependencies?.['@types/react-dom']) {
        print(colors.green, `✅ @types/react-dom ${pkg.devDependencies['@types/react-dom']} instalado`);
      } else {
        print(colors.red, '❌ @types/react-dom no instalado');
      }
      
      // Verificar otros tipos importantes
      const importantTypes = [
        '@types/node',
        '@types/react-router-dom'
      ];
      
      importantTypes.forEach(type => {
        if (pkg.devDependencies?.[type]) {
          print(colors.green, `✅ ${type} instalado`);
        } else {
          print(colors.yellow, `⚠️  ${type} no instalado`);
        }
      });
      
    } catch (error) {
      print(colors.red, '❌ Error al leer package.json');
    }
  } else {
    print(colors.red, '❌ package.json no encontrado');
  }
}

function checkTypeFiles() {
  printSection('📁 ARCHIVOS DE TIPOS');
  
  const typesDir = path.join(process.cwd(), 'src', 'types');
  
  if (fs.existsSync(typesDir)) {
    print(colors.green, '✅ Directorio /src/types encontrado');
    
    const typeFiles = fs.readdirSync(typesDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
      .map(file => file.replace('.ts', '').replace('.tsx', ''));
    
    if (typeFiles.length > 0) {
      print(colors.white, `   Archivos de tipos encontrados: ${typeFiles.length}`);
      typeFiles.forEach(file => {
        print(colors.white, `   - ${file}`);
      });
    } else {
      print(colors.yellow, '⚠️  No se encontraron archivos de tipos');
    }
  } else {
    print(colors.red, '❌ Directorio /src/types no encontrado');
  }
}

function checkComponentFiles() {
  printSection('🧩 COMPONENTES');
  
  const srcDir = path.join(process.cwd(), 'src');
  const componentsDir = path.join(srcDir, 'components');
  
  if (fs.existsSync(componentsDir)) {
    const jsxFiles = countFiles(componentsDir, '.jsx');
    const tsxFiles = countFiles(componentsDir, '.tsx');
    const jsFiles = countFiles(componentsDir, '.js');
    const tsFiles = countFiles(componentsDir, '.ts');
    
    print(colors.white, `📊 Estadísticas de archivos:`);
    print(colors.white, `   - Archivos .jsx: ${jsxFiles}`);
    print(colors.white, `   - Archivos .tsx: ${tsxFiles}`);
    print(colors.white, `   - Archivos .js: ${jsFiles}`);
    print(colors.white, `   - Archivos .ts: ${tsFiles}`);
    
    const totalComponents = jsxFiles + tsxFiles + jsFiles + tsFiles;
    const typedComponents = tsxFiles + tsFiles;
    const percentage = totalComponents > 0 ? Math.round((typedComponents / totalComponents) * 100) : 0;
    
    print(colors.white, `   - Total de componentes: ${totalComponents}`);
    print(colors.white, `   - Componentes tipados: ${typedComponents}`);
    print(colors.white, `   - Porcentaje tipado: ${percentage}%`);
    
    if (percentage === 0) {
      print(colors.red, '❌ Ningún componente está tipado');
    } else if (percentage < 25) {
      print(colors.yellow, '⚠️  Pocos componentes están tipados');
    } else if (percentage < 50) {
      print(colors.yellow, '⚠️  Menos de la mitad de componentes están tipados');
    } else if (percentage < 75) {
      print(colors.blue, '📈 Más de la mitad de componentes están tipados');
    } else if (percentage < 100) {
      print(colors.green, '✅ La mayoría de componentes están tipados');
    } else {
      print(colors.green, '🎉 ¡Todos los componentes están tipados!');
    }
  } else {
    print(colors.red, '❌ Directorio /src/components no encontrado');
  }
}

function checkServiceFiles() {
  printSection('🔧 SERVICIOS');
  
  const srcDir = path.join(process.cwd(), 'src');
  const servicesDir = path.join(srcDir, 'services');
  
  if (fs.existsSync(servicesDir)) {
    const jsFiles = countFiles(servicesDir, '.js');
    const tsFiles = countFiles(servicesDir, '.ts');
    
    print(colors.white, `📊 Estadísticas de servicios:`);
    print(colors.white, `   - Archivos .js: ${jsFiles}`);
    print(colors.white, `   - Archivos .ts: ${tsFiles}`);
    
    const totalServices = jsFiles + tsFiles;
    const percentage = totalServices > 0 ? Math.round((tsFiles / totalServices) * 100) : 0;
    
    print(colors.white, `   - Total de servicios: ${totalServices}`);
    print(colors.white, `   - Servicios tipados: ${tsFiles}`);
    print(colors.white, `   - Porcentaje tipado: ${percentage}%`);
    
    if (percentage === 0) {
      print(colors.red, '❌ Ningún servicio está tipado');
    } else if (percentage < 50) {
      print(colors.yellow, '⚠️  Menos de la mitad de servicios están tipados');
    } else if (percentage < 100) {
      print(colors.blue, '📈 Más de la mitad de servicios están tipados');
    } else {
      print(colors.green, '🎉 ¡Todos los servicios están tipados!');
    }
  } else {
    print(colors.yellow, '⚠️  Directorio /src/services no encontrado');
  }
}

function checkHookFiles() {
  printSection('🎣 HOOKS');
  
  const srcDir = path.join(process.cwd(), 'src');
  const hooksDir = path.join(srcDir, 'hooks');
  
  if (fs.existsSync(hooksDir)) {
    const jsFiles = countFiles(hooksDir, '.js');
    const tsFiles = countFiles(hooksDir, '.ts');
    const jsxFiles = countFiles(hooksDir, '.jsx');
    const tsxFiles = countFiles(hooksDir, '.tsx');
    
    print(colors.white, `📊 Estadísticas de hooks:`);
    print(colors.white, `   - Archivos .js/.jsx: ${jsFiles + jsxFiles}`);
    print(colors.white, `   - Archivos .ts/.tsx: ${tsFiles + tsxFiles}`);
    
    const totalHooks = jsFiles + jsxFiles + tsFiles + tsxFiles;
    const typedHooks = tsFiles + tsxFiles;
    const percentage = totalHooks > 0 ? Math.round((typedHooks / totalHooks) * 100) : 0;
    
    print(colors.white, `   - Total de hooks: ${totalHooks}`);
    print(colors.white, `   - Hooks tipados: ${typedHooks}`);
    print(colors.white, `   - Porcentaje tipado: ${percentage}%`);
    
    if (percentage === 0) {
      print(colors.red, '❌ Ningún hook está tipado');
    } else if (percentage < 50) {
      print(colors.yellow, '⚠️  Menos de la mitad de hooks están tipados');
    } else if (percentage < 100) {
      print(colors.blue, '📈 Más de la mitad de hooks están tipados');
    } else {
      print(colors.green, '🎉 ¡Todos los hooks están tipados!');
    }
  } else {
    print(colors.yellow, '⚠️  Directorio /src/hooks no encontrado');
  }
}

function checkTypeScriptErrors() {
  printSection('🔍 VERIFICACIÓN DE TIPOS');
  
  try {
    print(colors.white, 'Ejecutando verificación de tipos...');
    const result = execSync('npx tsc --noEmit', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    print(colors.green, '✅ No se encontraron errores de TypeScript');
  } catch (error) {
    if (error.stdout) {
      print(colors.red, '❌ Errores de TypeScript encontrados:');
      console.log(error.stdout);
    } else {
      print(colors.yellow, '⚠️  No se pudo verificar los tipos de TypeScript');
    }
  }
}

function generateProgressReport() {
  printSection('📊 REPORTE DE PROGRESO');
  
  const srcDir = path.join(process.cwd(), 'src');
  const componentsDir = path.join(srcDir, 'components');
  const servicesDir = path.join(srcDir, 'services');
  const hooksDir = path.join(srcDir, 'hooks');
  
  let totalFiles = 0;
  let typedFiles = 0;
  
  // Contar archivos de componentes
  if (fs.existsSync(componentsDir)) {
    totalFiles += countFiles(componentsDir, '.jsx') + countFiles(componentsDir, '.js');
    typedFiles += countFiles(componentsDir, '.tsx') + countFiles(componentsDir, '.ts');
  }
  
  // Contar archivos de servicios
  if (fs.existsSync(servicesDir)) {
    totalFiles += countFiles(servicesDir, '.js');
    typedFiles += countFiles(servicesDir, '.ts');
  }
  
  // Contar archivos de hooks
  if (fs.existsSync(hooksDir)) {
    totalFiles += countFiles(hooksDir, '.js') + countFiles(hooksDir, '.jsx');
    typedFiles += countFiles(hooksDir, '.ts') + countFiles(hooksDir, '.tsx');
  }
  
  const percentage = totalFiles > 0 ? Math.round((typedFiles / totalFiles) * 100) : 0;
  
  print(colors.white, `📈 Progreso general de migración:`);
  print(colors.white, `   - Archivos totales: ${totalFiles}`);
  print(colors.white, `   - Archivos tipados: ${typedFiles}`);
  print(colors.white, `   - Porcentaje completado: ${percentage}%`);
  
  // Barra de progreso visual
  const barLength = 30;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  print(colors.white, `   [${bar}] ${percentage}%`);
  
  // Recomendaciones
  print(colors.cyan, '\n💡 Recomendaciones:');
  
  if (percentage === 0) {
    print(colors.yellow, '   - Comenzar con la migración de componentes principales');
    print(colors.yellow, '   - Crear tipos base para las entidades principales');
    print(colors.yellow, '   - Configurar ESLint para TypeScript');
  } else if (percentage < 25) {
    print(colors.yellow, '   - Continuar con componentes de alta prioridad');
    print(colors.yellow, '   - Migrar servicios críticos');
    print(colors.yellow, '   - Crear tipos para APIs');
  } else if (percentage < 50) {
    print(colors.blue, '   - Migrar componentes restantes');
    print(colors.blue, '   - Completar migración de servicios');
    print(colors.blue, '   - Migrar hooks personalizados');
  } else if (percentage < 75) {
    print(colors.green, '   - Finalizar migración de componentes');
    print(colors.green, '   - Optimizar tipos existentes');
    print(colors.green, '   - Habilitar strict mode gradualmente');
  } else {
    print(colors.green, '   - Revisar y optimizar tipos');
    print(colors.green, '   - Habilitar todas las opciones strict');
    print(colors.green, '   - Documentar mejores prácticas');
  }
}

function printFooter() {
  console.log('\n' + '='.repeat(80));
  print(colors.bright + colors.cyan, '📅 Reporte generado: ' + new Date().toLocaleString('es-ES'));
  console.log('='.repeat(80) + '\n');
}

// Función principal
function main() {
  printHeader();
  
  checkTypeScriptConfig();
  checkPackageJson();
  checkTypeFiles();
  checkComponentFiles();
  checkServiceFiles();
  checkHookFiles();
  checkTypeScriptErrors();
  generateProgressReport();
  
  printFooter();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkTypeScriptConfig,
  checkPackageJson,
  checkTypeFiles,
  checkComponentFiles,
  checkServiceFiles,
  checkHookFiles,
  checkTypeScriptErrors,
  generateProgressReport
};
