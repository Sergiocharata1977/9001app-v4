# 📁 ESTRUCTURA DEL PROYECTO 9001APP2

## ⚠️ REGLA FUNDAMENTAL

**TODO DEBE ESTAR DENTRO DE `frontend/` O `backend/`**

No crear carpetas sueltas en la raíz del proyecto.

## 🎯 ESTRUCTURA CORRECTA

```
9001app2/
├── frontend/                    # ✅ FRONTEND - React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── schemas/
│   │   ├── assets/
│   │   ├── data/
│   │   ├── docs/
│   │   ├── types/
│   │   └── styles/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── index.html
│
├── backend/                     # ✅ BACKEND - Node.js + Express
│   ├── index.js
│   ├── package.json
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── lib/
│   ├── config/
│   ├── database/
│   ├── docs/
│   ├── tests/
│   ├── scripts/
│   └── uploads/
│
├── deploy-server.sh            # ✅ Scripts de despliegue
├── setup-server.sh
├── clean-structure.ps1
├── migrate-isoflow4.ps1
├── README-DEPLOY.md
├── ESTRUCTURA_PROYECTO.md      # Este archivo
└── CONTEXTO_REFACTORIZACION.md
```

## ❌ ESTRUCTURA INCORRECTA

```
9001app2/
├── frontend/                   # ✅ Correcto
├── backend/                    # ✅ Correcto
├── Frontend/                   # ❌ DUPLICADO - Eliminar
├── 9001app2/                  # ❌ ANIDADO - Eliminar
├── src/                       # ❌ SUELTO - Mover a frontend/src
├── components/                # ❌ SUELTO - Mover a frontend/src/components
├── pages/                     # ❌ SUELTO - Mover a frontend/src/pages
└── ...
```

## 🔧 COMANDOS PARA VERIFICAR ESTRUCTURA

### En PowerShell (Local)
```powershell
# Verificar estructura
Get-ChildItem -Path "." -Directory | ForEach-Object { Write-Host $_.Name }

# Verificar que solo existan frontend y backend
$folders = Get-ChildItem -Path "." -Directory
$allowed = @("frontend", "backend", ".git")
$invalid = $folders | Where-Object { $_.Name -notin $allowed }
if ($invalid) {
    Write-Host "❌ Carpetas no permitidas:" -ForegroundColor Red
    $invalid | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Red }
} else {
    Write-Host "✅ Estructura correcta" -ForegroundColor Green
}
```

### En Linux (Servidor)
```bash
# Verificar estructura
ls -la

# Verificar que solo existan frontend y backend
for folder in */; do
    if [[ "$folder" != "frontend/" && "$folder" != "backend/" && "$folder" != ".git/" ]]; then
        echo "❌ Carpeta no permitida: $folder"
    fi
done
```

## 📋 REGLAS DE ORGANIZACIÓN

### 1. **FRONTEND** (`frontend/`)
- ✅ Todo el código React/JavaScript
- ✅ Componentes, páginas, servicios
- ✅ Configuración de Vite, Tailwind, PostCSS
- ✅ Assets, imágenes, estilos
- ✅ Tests del frontend

### 2. **BACKEND** (`backend/`)
- ✅ Todo el código Node.js/Express
- ✅ Controladores, rutas, middleware
- ✅ Base de datos, migraciones
- ✅ Configuración del servidor
- ✅ Tests del backend

### 3. **SCRIPTS** (raíz del proyecto)
- ✅ Scripts de despliegue (`deploy-server.sh`)
- ✅ Scripts de configuración (`setup-server.sh`)
- ✅ Scripts de migración (`migrate-isoflow4.ps1`)
- ✅ Documentación (`README-DEPLOY.md`)

## 🚨 ADVERTENCIAS

### ❌ NO HACER:
- Crear carpetas sueltas en la raíz
- Duplicar carpetas (`Frontend` vs `frontend`)
- Anidar carpetas innecesariamente
- Mover archivos fuera de `frontend/` o `backend/`

### ✅ SÍ HACER:
- Mantener todo organizado en `frontend/` o `backend/`
- Usar nombres consistentes (minúsculas)
- Documentar cambios en la estructura
- Verificar antes de hacer commit

## 🔍 VERIFICACIÓN ANTES DE COMMIT

Antes de hacer `git add .` y `git commit`, verificar:

1. **Estructura correcta**: Solo `frontend/` y `backend/`
2. **Sin duplicados**: No hay `Frontend/` o `9001app2/` anidados
3. **Archivos en su lugar**: Todo dentro de las carpetas correctas
4. **Funcionamiento**: `npm run dev` funciona en frontend

## 📝 COMANDOS ÚTILES

```bash
# Verificar estructura
tree -L 2

# Verificar que frontend funcione
cd frontend && npm run dev

# Verificar que backend funcione
cd backend && npm run dev

# Limpiar si hay problemas
./clean-structure.ps1
```

## 🔧 ESTANDARIZACIÓN DE MÓDULOS

### **DECISIÓN: CommonJS en todo el proyecto**

**Razones:**
- ✅ Más compatible con Node.js
- ✅ Menos problemas de configuración
- ✅ Mejor para desarrollo local
- ✅ Compatible con todas las librerías

### **REGLAS DE ESTANDARIZACIÓN:**

#### **BACKEND - Todo CommonJS:**
```javascript
// ✅ CORRECTO - CommonJS
const express = require('express');
const { authController } = require('../controllers/authController.js');
module.exports = router;

// ❌ INCORRECTO - ES Modules
import express from 'express';
import { authController } from '../controllers/authController.js';
export default router;
```

#### **FRONTEND - ES Modules (React):**
```javascript
// ✅ CORRECTO - ES Modules para React
import React from 'react';
import { useState } from 'react';
export default Component;

// ❌ INCORRECTO - CommonJS en React
const React = require('react');
module.exports = Component;
```

### **ARCHIVOS A CONVERTIR:**

#### **Backend - Convertir a CommonJS:**
- [x] `backend/controllers/authController.js`
- [x] `backend/middleware/authMiddleware.js`
- [x] `backend/lib/tursoClient.js`
- [x] `backend/config/env-setup.js`
- [ ] `backend/routes/userRoutes.js`
- [ ] `backend/routes/authRoutes.js`
- [ ] `backend/controllers/userController.js`

#### **Frontend - Mantener ES Modules:**
- ✅ `frontend/src/App.jsx`
- ✅ `frontend/src/main.jsx`
- ✅ Todos los componentes React

### **COMANDOS DE CONVERSIÓN:**

```bash
# Convertir import/export a require/module.exports
# Ejemplo:
# ANTES: import express from 'express';
# DESPUÉS: const express = require('express');

# ANTES: export default router;
# DESPUÉS: module.exports = router;
```

### **VERIFICACIÓN DE ESTANDARIZACIÓN:**

```bash
# Verificar que no hay ES modules en backend
grep -r "import " backend/ --include="*.js"
grep -r "export " backend/ --include="*.js"

# Verificar que frontend usa ES modules
grep -r "require(" frontend/src/ --include="*.jsx"
```

---

**Última actualización**: $(date)
**Versión**: 1.0.0 