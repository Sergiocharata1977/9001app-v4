#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración simple
const DOCS_DIR = './docs';
const README_FILE = './README.md';

// Función para actualizar README principal
function updateMainReadme() {
  const timestamp = new Date().toLocaleString('es-ES');
  
  const content = `# 🤖 Sistema ISO Flow - Documentación

## 📅 Última Actualización: ${timestamp}

## 📂 Estructura del Proyecto

### 🎯 Componentes Principales
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **RAG**: Sistema de búsqueda de documentos
- **Documentación**: Markdown + Scripts de actualización

### 📋 Funcionalidades Activas
1. **Sistema de Gestión ISO 9001**
2. **Panel de Super Admin**
3. **Sistema de Agentes (Básico)**
4. **RAG para Documentos**

### 🔧 Scripts Disponibles
- \`npm run update-docs\`: Actualiza documentación
- \`npm run start\`: Inicia el servidor de desarrollo

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Actualizar documentación
npm run update-docs
\`\`\`

## 📚 Documentación Detallada

Ver carpeta \`docs/\` para documentación específica de cada módulo.

---
*Documentación generada automáticamente*
`;

  fs.writeFileSync(README_FILE, content);
  console.log('✅ README principal actualizado');
}

// Función para crear estructura de docs
function createDocsStructure() {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  const docs = [
    {
      name: 'frontend.md',
      content: `# Frontend - React + Tailwind

## Componentes Principales
- SuperAdminLayout
- AgentCoordinationSystem
- Sistema de rutas

## Scripts
- \`npm run dev\`: Desarrollo
- \`npm run build\`: Producción
`
    },
    {
      name: 'backend.md',
      content: `# Backend - Node.js + Express

## Servicios
- Autenticación
- Gestión de usuarios
- API REST

## RAG-Backend
- Búsqueda de documentos
- Respuestas contextuales
`
    },
    {
      name: 'scripts.md',
      content: `# Scripts de Automatización

## update-docs.js
Actualiza automáticamente la documentación del proyecto.

## Uso
\`\`\`bash
node scripts/update-docs.js
\`\`\`
`
    }
  ];

  docs.forEach(doc => {
    const filePath = path.join(DOCS_DIR, doc.name);
    fs.writeFileSync(filePath, doc.content);
    console.log(`✅ ${doc.name} creado`);
  });
}

// Función principal
function main() {
  console.log('🔄 Actualizando documentación...');
  
  updateMainReadme();
  createDocsStructure();
  
  console.log('✅ Documentación actualizada completamente');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { updateMainReadme, createDocsStructure };
