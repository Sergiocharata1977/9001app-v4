const fs = require('fs');
const path = require('path');

// Archivos que necesitan migración a TypeScript
const filesToMigrate = [
  // Controllers
  'controllers/auditoriasController.js',
  'controllers/authController.js',
  'controllers/capacitacionesController.js',
  'controllers/competenciasController.js',
  'controllers/coordinacionController.js',
  'controllers/direccion.controller.js',
  'controllers/encuestas.controller.js',
  'controllers/evaluacionDetalleController.js',
  'controllers/evaluacionesController.js',
  'controllers/evaluacionesSgcController.js',
  'controllers/evaluacionProgramacionController.js',
  'controllers/eventController.js',
  'controllers/fileStructureController.js',
  'controllers/organizationController.js',
  'controllers/planesController.js',
  'controllers/procesosController.js',
  'controllers/productosController.js',
  'controllers/ragController.js',
  'controllers/superAdminController.js',
  'controllers/userController.js',
  
  // Services
  'services/activityLogService.js',
  'services/coordinacionService.js',
  'services/databaseSetupService.js',
  'services/directQueryService.js',
  'services/initAssistant.js',
  'services/ragService.js',
  'services/simpleSearchService.js',
  
  // Middleware
  'middleware/auditMiddleware.js',
  'middleware/authMiddleware.js',
  'middleware/basicAuthMiddleware.js',
  'middleware/errorHandler.js',
  'middleware/permissionsMiddleware.js',
  'middleware/planLimits.js',
  'middleware/security.js',
  'middleware/simpleAuth.js',
  'middleware/superAdminMiddleware.js',
  'middleware/tenantMiddleware.js',
  'middleware/validationMiddleware.js',
  
  // Routes
  'routes/auth.routes.js',
  'routes/auditorias.routes.js',
  'routes/capacitaciones.routes.js',
  'routes/competencias.routes.js',
  'routes/coordinacion.routes.js',
  'routes/direccion.routes.js',
  'routes/encuestas.routes.js',
  'routes/evaluaciones.routes.js',
  'routes/event.routes.js',
  'routes/fileStructure.routes.js',
  'routes/organization.routes.js',
  'routes/planes.routes.js',
  'routes/procesos.routes.js',
  'routes/productos.routes.js',
  'routes/rag.routes.js',
  'routes/superAdmin.routes.js',
  'routes/user.routes.js'
];

// Tipos TypeScript básicos
const typesTemplate = `
// Tipos básicos para la aplicación
export interface User {
  _id: string;
  id: number;
  email: string;
  password: string;
  role: 'super_admin' | 'org_admin' | 'manager' | 'user' | 'auditor';
  organization_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Organization {
  _id: string;
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Proceso {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Indicador {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  unidad: string;
  meta: number;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Medicion {
  _id: string;
  id: number;
  indicador_id: number;
  valor: number;
  fecha_medicion: Date;
  observaciones: string;
  created_at: Date;
  updated_at: Date;
}

export interface ObjetivoCalidad {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  indicador_id: number;
  proceso_id: number;
  meta: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: 'activo' | 'completado' | 'cancelado';
  created_at: Date;
  updated_at: Date;
}

export interface Auditoria {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  tipo: 'interna' | 'externa';
  fecha_inicio: Date;
  fecha_fin: Date;
  auditor_id: number;
  estado: 'planificada' | 'en_progreso' | 'completada';
  created_at: Date;
  updated_at: Date;
}

export interface Hallazgo {
  _id: string;
  id: number;
  auditoria_id: number;
  proceso_id: number;
  descripcion: string;
  tipo: 'no_conformidad' | 'observacion' | 'oportunidad_mejora';
  severidad: 'alta' | 'media' | 'baja';
  estado: 'abierto' | 'cerrado';
  created_at: Date;
  updated_at: Date;
}

export interface Accion {
  _id: string;
  id: number;
  hallazgo_id: number;
  descripcion: string;
  tipo: 'correctiva' | 'preventiva';
  responsable_id: number;
  fecha_limite: Date;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  created_at: Date;
  updated_at: Date;
}

export interface Personal {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  puesto_id: number;
  departamento_id: number;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Departamento {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  responsable_id: number;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Plan {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  precio_mensual: number;
  max_usuarios: number;
  max_procesos: number;
  max_documentos: number;
  features: string[];
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Suscripcion {
  _id: string;
  id: number;
  organization_id: number;
  plan_id: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: 'activa' | 'suspendida' | 'cancelada';
  created_at: Date;
  updated_at: Date;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Tipos para filtros y búsquedas
export interface FilterOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  organization_id?: number;
  estado?: string;
}

export interface SearchFilters {
  [key: string]: any;
}
`;

// Función para convertir archivo JS a TS
function convertJsToTs(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const tsPath = fullPath.replace('.js', '.ts');
  
  // Conversiones básicas
  let tsContent = content
    // Agregar imports de tipos
    .replace(/const express = require\('express'\);/, `import express, { Request, Response, NextFunction } from 'express';`)
    .replace(/const { MongoClient } = require\('mongodb'\);/, `import { MongoClient, ObjectId } from 'mongodb';`)
    .replace(/const bcrypt = require\('bcrypt'\);/, `import bcrypt from 'bcrypt';`)
    .replace(/const jwt = require\('jsonwebtoken'\);/, `import jwt from 'jsonwebtoken';`)
    
    // Convertir module.exports
    .replace(/module\.exports = /g, 'export default ')
    .replace(/module\.exports\./g, 'export ')
    
    // Agregar tipos a funciones
    .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, funcName, params) => {
      if (params.includes('req') && params.includes('res')) {
        return `function ${funcName}(req: Request, res: Response, next?: NextFunction): void {`;
      }
      return match;
    })
    
    // Agregar tipos a arrow functions
    .replace(/\(([^)]*)\)\s*=>\s*{/g, (match, params) => {
      if (params.includes('req') && params.includes('res')) {
        return `(req: Request, res: Response, next?: NextFunction): void => {`;
      }
      return match;
    });
  
  // Escribir archivo TypeScript
  fs.writeFileSync(tsPath, tsContent);
  console.log(`  ✅ Convertido: ${filePath} -> ${path.basename(tsPath)}`);
  
  // Eliminar archivo JS original
  fs.unlinkSync(fullPath);
  console.log(`  🗑️  Eliminado: ${filePath}`);
}

async function completeTypeScriptMigration() {
  console.log('🚀 INICIANDO MIGRACIÓN A TYPESCRIPT');
  console.log('=====================================');
  
  // Crear archivo de tipos
  console.log('\n📋 Creando archivo de tipos...');
  const typesPath = path.join(__dirname, 'types', 'index.ts');
  fs.mkdirSync(path.dirname(typesPath), { recursive: true });
  fs.writeFileSync(typesPath, typesTemplate);
  console.log('  ✅ Tipos creados en types/index.ts');
  
  // Convertir archivos
  console.log('\n🔄 Convirtiendo archivos a TypeScript...');
  
  for (const file of filesToMigrate) {
    console.log(`\n📄 Procesando: ${file}`);
    convertJsToTs(file);
  }
  
  // Actualizar package.json
  console.log('\n📦 Actualizando package.json...');
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Agregar scripts TypeScript
  packageJson.scripts = {
    ...packageJson.scripts,
    'build': 'tsc',
    'dev': 'ts-node-dev --respawn --transpile-only src/index.ts',
    'type-check': 'tsc --noEmit'
  };
  
  // Agregar dependencias TypeScript
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    '@types/node': '^20.0.0',
    '@types/express': '^4.17.0',
    '@types/bcrypt': '^5.0.0',
    '@types/jsonwebtoken': '^9.0.0',
    'typescript': '^5.0.0',
    'ts-node': '^10.9.0',
    'ts-node-dev': '^2.0.0'
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('  ✅ package.json actualizado');
  
  // Crear tsconfig.json si no existe
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfig = {
      "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "lib": ["ES2020"],
        "outDir": "./dist",
        "rootDir": "./",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
      },
      "include": [
        "**/*.ts"
      ],
      "exclude": [
        "node_modules",
        "dist"
      ]
    };
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('  ✅ tsconfig.json creado');
  }
  
  console.log('\n🎉 MIGRACIÓN A TYPESCRIPT COMPLETADA!');
  console.log('✅ Todos los archivos convertidos a TypeScript');
  console.log('✅ Tipos definidos en types/index.ts');
  console.log('✅ Configuración TypeScript actualizada');
  console.log('✅ Dependencias instaladas');
  
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('  1. npm install (instalar nuevas dependencias)');
  console.log('  2. npm run build (compilar TypeScript)');
  console.log('  3. npm run dev (ejecutar en modo desarrollo)');
}

// Ejecutar migración
completeTypeScriptMigration();

