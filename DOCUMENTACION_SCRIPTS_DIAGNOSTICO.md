# 📋 DOCUMENTACIÓN DE SCRIPTS DE DIAGNÓSTICO - 9001APP2

## 📖 ÍNDICE
1. [Resumen de Scripts](#resumen-de-scripts)
2. [Scripts Disponibles](#scripts-disponibles)
3. [Comandos de Diagnóstico Manual](#comandos-de-diagnóstico-manual)
4. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
5. [Logs y Monitoreo](#logs-y-monitoreo)

---

## 🎯 RESUMEN DE SCRIPTS

### Scripts Creados:
- **`debug-errors.ps1`** - Script completo de diagnóstico (DEPRECADO - errores de sintaxis)
- **`debug-simple.ps1`** - Script simplificado de diagnóstico funcional
- **`deploy-9001app2.sh`** - Script de despliegue automático en servidor (ubicado en `/root/`)

### Propósito:
Automatizar el diagnóstico de problemas de conectividad, routing y autenticación en el sistema 9001APP2.

---

## 📁 SCRIPTS DISPONIBLES

### 1. **debug-simple.ps1** ✅ FUNCIONAL
**Ubicación:** `./debug-simple.ps1`  
**Plataforma:** Windows PowerShell  
**Propósito:** Diagnóstico rápido de conectividad y servicios

#### ▶️ Uso:
```powershell
# Ejecutar desde el directorio raíz del proyecto
powershell.exe -ExecutionPolicy Bypass -File debug-simple.ps1
```

#### 🔍 Qué verifica:
1. **Conectividad VPS** - Ping a 31.97.162.229
2. **Frontend (Puerto 3000)**
   - Página principal: `http://31.97.162.229:3000/`
   - Página de login: `http://31.97.162.229:3000/login`
3. **Backend (Puerto 5000)**
   - Health check: `http://31.97.162.229:5000/api/health`
4. **Archivos locales**
   - Build del frontend (`frontend/dist/index.html`)
   - Rutas de la aplicación (`frontend/src/routes/AppRoutes.jsx`)
5. **Estado de Git**
   - Rama actual
   - Último commit

#### 📊 Salida esperada:
```
=== DIAGNÓSTICO 9001APP2 ===

1. VERIFICANDO VPS CONECTIVIDAD...
✅ VPS accesible

2. VERIFICANDO FRONTEND (Puerto 3000)...
✅ Frontend Principal - Status: 200
❌ Login Page ERROR: 404 - PROBLEMA: Routing SPA no configurado

3. VERIFICANDO BACKEND (Puerto 5000)...
✅ Backend Health - Response: {"status":"ok","timestamp":"..."}

4. VERIFICANDO ARCHIVOS LOCALES...
✅ Build del frontend existe
✅ AppRoutes.jsx existe

5. ESTADO DEL GIT...
Rama: master
Commit: 9c5cd44 Fix: Arreglar problemas críticos de autenticación
```

---

### 2. **deploy-9001app2.sh** ✅ FUNCIONAL
**Ubicación:** `/root/deploy-9001app2.sh` (en servidor VPS)  
**Plataforma:** Ubuntu Linux  
**Propósito:** Despliegue automático completo

#### ▶️ Uso:
```bash
# Ejecutar en el servidor VPS como root
/root/deploy-9001app2.sh
```

#### 🔄 Proceso automático:
1. **📥 Descargar cambios** del repositorio GitLab
2. **🔧 Instalar dependencias** backend y frontend
3. **🏗️ Construir frontend** optimizado para producción
4. **🔄 Reiniciar servicios** PM2 (backend y frontend)
5. **🏥 Verificar salud** del sistema
6. **✅ Confirmar** despliegue exitoso

#### 📊 Salida esperada:
```
🚀 INICIANDO DESPLIEGUE AUTOMÁTICO
================================================
[2025-01-28] 🎯 INICIANDO PROCESO DE DESPLIEGUE
[2025-01-28] 📥 DESCARGANDO CAMBIOS DEL REPOSITORIO...
[2025-01-28] ✅ Código actualizado desde GitLab
[2025-01-28] 🔧 INSTALANDO DEPENDENCIAS DEL BACKEND...
[2025-01-28] ✅ Dependencias backend instaladas
[2025-01-28] 🎨 INSTALANDO DEPENDENCIAS DEL FRONTEND...
[2025-01-28] ✅ Dependencias frontend instaladas
[2025-01-28] 🏗️ CONSTRUYENDO FRONTEND...
[2025-01-28] ✅ Frontend construido exitosamente
[2025-01-28] 🔄 REINICIANDO SERVICIOS...
[2025-01-28] 🏥 VERIFICANDO SALUD DEL SISTEMA...
[2025-01-28] ✅ Backend funcionando correctamente
[2025-01-28] ✅ Frontend funcionando correctamente
[2025-01-28] 🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE
```

---

## 🔧 COMANDOS DE DIAGNÓSTICO MANUAL

### Windows PowerShell:
```powershell
# Verificar conectividad
Test-Connection -ComputerName 31.97.162.229 -Count 2

# Verificar frontend
Invoke-WebRequest -Uri "http://31.97.162.229:3000" -UseBasicParsing

# Verificar backend
Invoke-WebRequest -Uri "http://31.97.162.229:5000/api/health" -UseBasicParsing

# Verificar login (detecta problema SPA)
Invoke-WebRequest -Uri "http://31.97.162.229:3000/login" -UseBasicParsing
```

### Linux/Unix (desde servidor):
```bash
# Estado de servicios PM2
pm2 status

# Logs del backend
pm2 logs 9001app2-backend --lines 20

# Logs del frontend
pm2 logs 9001app2-frontend --lines 20

# Verificar Nginx
nginx -t
systemctl status nginx

# Health checks locales
curl http://localhost:5000/api/health
curl http://localhost:3000
```

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### 1. **ERROR 404 en rutas del frontend (ej: /login)**
**Síntoma:** Frontend principal funciona, pero rutas como `/login` dan 404

**Causa:** Nginx no configurado para SPA (Single Page Application) routing

**Solución:**
```bash
# En el servidor, verificar configuración nginx
sudo nano /etc/nginx/sites-available/default

# Asegurar que tenga:
location / {
    try_files $uri $uri/ /index.html;
}

# Reiniciar nginx
sudo nginx -s reload
```

### 2. **Backend no responde**
**Síntoma:** Error de conectividad en puerto 5000

**Diagnóstico:**
```bash
pm2 status
pm2 logs 9001app2-backend --lines 50
```

**Solución:**
```bash
pm2 restart 9001app2-backend
```

### 3. **Frontend no carga**
**Síntoma:** Página en blanco o error de carga

**Diagnóstico:**
```bash
pm2 logs 9001app2-frontend --lines 50
ls -la /path/to/frontend/dist/
```

**Solución:**
```bash
# Reconstruir y reiniciar
cd /path/to/project/frontend
npm run build
pm2 restart 9001app2-frontend
```

### 4. **Problemas de autenticación**
**Síntoma:** Login exitoso pero vuelve al login

**Verificar:**
- Token almacenado en localStorage
- Función `initializeAuth` en authStore.js
- Rutas protegidas en AppRoutes.jsx

**Solución:** Ver arreglos implementados en commit `9c5cd44`

---

## 📊 LOGS Y MONITOREO

### Archivos de Log importantes:
```bash
# Logs de despliegue
/var/log/9001app2-deploy.log

# Logs de PM2
~/.pm2/logs/

# Logs de Nginx
/var/log/nginx/access.log
/var/log/nginx/error.log
```

### Comandos de monitoreo:
```bash
# Ver logs en tiempo real
tail -f /var/log/9001app2-deploy.log

# Monitoreo PM2
pm2 monit

# Estado general del sistema
systemctl status nginx
systemctl status ssh
df -h
free -m
```

---

## 🔄 WORKFLOW RECOMENDADO

### Para desarrollo local:
1. **Hacer cambios** en código
2. **Commitear** a Git: `git add . && git commit -m "..."`
3. **Push** a GitLab: `git push origin master`
4. **Ejecutar diagnóstico local:** `powershell.exe -ExecutionPolicy Bypass -File debug-simple.ps1`

### Para despliegue a producción:
1. **SSH al servidor:** `ssh root@31.97.162.229`
2. **Ejecutar despliegue:** `/root/deploy-9001app2.sh`
3. **Verificar funcionamiento:** Visitar URLs del sistema
4. **Revisar logs** si hay problemas: `pm2 logs`

---

## 📞 CONTACTO Y SOPORTE

### URLs del sistema:
- **Frontend:** http://31.97.162.229:3000
- **Backend:** http://31.97.162.229:5000
- **API Health:** http://31.97.162.229:5000/api/health

### Credenciales de prueba:
- **Email:** admin@demo.com
- **Password:** admin123

---

**Última actualización:** 2025-01-28  
**Versión de scripts:** 1.0  
**Estado:** Scripts operativos y documentados

---

## 📝 NOTAS TÉCNICAS

### Limitaciones identificadas:
1. **PowerShell en Windows:** No soporta sintaxis `&&` para comandos concatenados
2. **Routing SPA:** Nginx requiere configuración específica para React Router
3. **CORS:** Verificar configuración si hay problemas entre frontend/backend

### Mejoras futuras:
1. Webhook automático desde GitLab
2. Monitoreo automático de servicios
3. Alertas por email en caso de caídas
4. Script de rollback automático
