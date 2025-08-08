# 🚀 PLAN DE DESPLIEGUE Y MEJORAS - 9001APP2

## 📋 RESUMEN EJECUTIVO

**Objetivo**: Migrar de despliegue manual/cron a CI/CD robusto con GitLab, usando Nginx para estáticos y PM2 solo para backend.

**Estrategia**: Plan incremental por etapas con rollback claro, sin tocar manualmente el servidor salvo cuando sea inevitable.

**Estado actual**: ✅ Scripts endurecidos, Nginx sirviendo estáticos, PM2 gestionando backend
**Meta final**: ✅ CI/CD automático, rollback simple, monitoreo básico

---

## 🎯 ARQUITECTURA OBJETIVO

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitLab CI     │───▶│   VPS Server     │───▶│   Usuarios      │
│                 │    │                  │    │                 │
│ • Auto deploy   │    │ • Nginx:80       │    │ • Web App       │
│ • Health checks │    │ • PM2 backend    │    │ • API /api/*    │
│ • Rollback      │    │ • Logs           │    │ • SSL (futuro)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Componentes**:
- **Frontend**: Nginx sirviendo desde `/var/www/9001app2/dist` (puerto 80)
- **Backend**: PM2 gestionando `9001app2-backend` (puerto 5000, proxy via `/api`)
- **Deploy**: GitLab CI ejecutando `deploy-server.sh` por SSH
- **Rollback**: Releases con symlinks + PM2 previous state

---

## 📈 PLAN POR ETAPAS

### **ETAPA 0 — Congelar Estado Estable Actual** ✅ *COMPLETADO*

**Objetivo**: Asegurar baseline estable antes de cambios

**Acciones realizadas**:
- ✅ Nginx sirviendo desde `/var/www/9001app2/dist`
- ✅ PM2 solo para `9001app2-backend`
- ✅ Scripts endurecidos con `set -euo pipefail`
- ✅ Eliminado `npx serve`, solo Nginx para estáticos
- ✅ Health checks en `/api/health`

**Verificación**:
```bash
curl http://31.97.162.229/           # → 200 OK
curl http://31.97.162.229/api/health # → {"status":"ok"}
pm2 list                             # → 9001app2-backend online
```

---

### **ETAPA 1 — Endurecer Despliegue** ✅ *COMPLETADO*

**Objetivo**: Scripts robustos con health checks y rollback básico

**Cambios aplicados en `deploy-server.sh`**:
- ✅ `set -euo pipefail` para fail-fast
- ✅ Eliminado `pm2 stop all/delete all`
- ✅ Uso de `pm2 reload 9001app2-backend || pm2 start ecosystem.config.cjs`
- ✅ Health check: `curl http://localhost:5000/api/health` antes de publicar frontend
- ✅ Frontend: `rsync` a `/var/www/9001app2/dist` + `systemctl reload nginx`
- ✅ Logs en `/root/deploy.log`

**Documentación**:
- ✅ `README-DEPLOY.md` actualizado con nuevo flujo

---

### **ETAPA 2 — CI/CD Mínimo en GitLab** 🔄 *PRÓXIMO*

**Objetivo**: Automatizar despliegue con GitLab CI/CD

#### **Fase 2A: Shadow Mode** (Validación)
```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_shadow:
  stage: deploy
  script:
    - echo "🔍 Modo Shadow - Solo validaciones"
    - ssh $SSH_USER@$SSH_HOST "cd /root/9001app2 && pwd"
    - ssh $SSH_USER@$SSH_HOST "nginx -t"
    - ssh $SSH_USER@$SSH_HOST "pm2 status"
    - echo "✅ Conectividad y servicios OK"
  only:
    - master
  when: manual
```

#### **Fase 2B: CI Activo** (Despliegue real)
```yaml
deploy_live:
  stage: deploy
  script:
    - ssh $SSH_USER@$SSH_HOST "cd /root/9001app2 && ./deploy-server.sh"
  only:
    - master
  when: manual  # Inicialmente manual, luego automático
```

**Variables requeridas en GitLab**:
- `SSH_HOST`: `31.97.162.229`
- `SSH_USER`: `root`
- `SSH_PRIVATE_KEY`: clave SSH privada

**Beneficios**:
- ✅ Despliegue desde GitLab UI
- ✅ Logs centralizados en GitLab
- ✅ Historial de despliegues
- ✅ Rollback a commit anterior

---

### **ETAPA 3 — Node 20 Upgrade** ⏳ *FUTURO*

**Objetivo**: Actualizar a Node 20 (requerido por react-router-dom@7)

**Riesgo**: Incompatibilidades con dependencias actuales

**Mitigación**:
1. **Prueba local**: Validar con Node 20 en desarrollo
2. **Ventana de mantenimiento**: Planificar downtime controlado
3. **Rollback preparado**: Mantener Node 18 disponible

**Comandos en servidor**:
```bash
# Backup actual
pm2 save

# Instalar Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verificar versión
node --version  # → v20.x.x

# Restart backend
cd /root/9001app2/backend
pm2 reload 9001app2-backend
```

**Rollback si falla**:
```bash
# Volver a Node 18
apt-get install -y nodejs=18.*
pm2 resurrect
```

---

### **ETAPA 4 — Seguridad Operativa** ⏳ *FUTURO*

**Objetivo**: Hardening de seguridad y operaciones

#### **4A: Usuario Dedicado**
```bash
# Crear usuario deployer
adduser deployer
usermod -aG sudo deployer

# Mover proyecto
mv /root/9001app2 /opt/9001app2
chown -R deployer:deployer /opt/9001app2

# PM2 para deployer
su - deployer
pm2 startup
pm2 save
```

#### **4B: HTTPS con Certbot**
```bash
# Instalar certbot
apt install certbot python3-certbot-nginx

# Certificado SSL (cuando tengas dominio)
certbot --nginx -d tu-dominio.com
```

#### **4C: Logs y Monitoreo**
```bash
# Logrotate para logs
cat > /etc/logrotate.d/9001app2 << EOF
/var/log/9001app2/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
EOF

# Opcional: Uptime monitoring
# Uptime Kuma apuntando a http://31.97.162.229/ y /api/health
```

---

### **ETAPA 5 — Entrega Funcional Incremental** ⏳ *FUTURO*

**Objetivo**: Completar funcionalidades ABM por módulos

**Orden propuesto**:
1. **Autenticación estable** → Login/logout funcionando
2. **Rutas protegidas** → Middleware de autenticación
3. **Menú lateral** → Navegación principal
4. **Primer ABM**: "Departamentos" como piloto

**Estrategia por módulo**:
```javascript
// 1. Integrar servicios
src/services/departamentosService.js

// 2. Componentes CRUD
src/components/departamentos/
├── DepartamentosListing.jsx
├── DepartamentoModal.jsx
└── DepartamentoSingle.jsx

// 3. React Query
const { data, isLoading, error } = useQuery(['departamentos'], 
  departamentosService.getAll
)

// 4. Validaciones
src/schemas/departamentoSchema.js

// 5. Rutas
src/routes/departamentos.js
```

**Una vez estable Departamentos** → Replicar patrón a otros ABM

---

## ⚖️ ROLES Y RESPONSABILIDADES

### 🤖 **ASISTENTE (AI)**

**Preparación Local**:
- ✅ Crear/modificar archivos de configuración
- ✅ Escribir scripts y documentación
- ✅ Preparar `.gitlab-ci.yml` y configs
- ✅ **NO ejecutar nada en servidor directamente**

**Análisis y Guía**:
- ✅ Analizar outputs de comandos del usuario
- ✅ Sugerir siguiente paso específico
- ✅ Detectar problemas y proponer fixes
- ✅ Mantener flujo "local → repo → server"

### 👤 **USUARIO**

**Desarrollo Local**:
- ✅ Ejecutar `npm run dev` para pruebas
- ✅ Revisar archivos preparados por asistente
- ✅ `git commit && git push` cuando apruebe cambios

**Ejecución en Servidor**:
- ✅ SSH al VPS según instrucciones
- ✅ Ejecutar comandos específicos proporcionados
- ✅ Compartir outputs para análisis
- ✅ Configurar variables en GitLab (SSH keys)

**Validación**:
- ✅ Probar URLs externas finales
- ✅ Confirmar funcionamiento antes de siguiente etapa

---

## 🎚️ CHECKPOINTS DE CONTROL

### **A) Local Smoke Test** 🏠
```bash
# Frontend
cd frontend && npm run dev
# → http://localhost:3000 muestra WebHome
# → Botón "Acceder" va a /login

# Backend  
cd backend && npm run dev
# → http://localhost:5000/api/health responde {"status":"ok"}
```

### **B) Git Pipeline** 🌐
```bash
git add .
git commit -m "ci: configurar GitLab CI shadow mode"
git push origin master
# → Pipeline shadow ejecuta sin errores
# → Conectividad SSH validada
```

### **C) Server Backend Health** ⚙️
```bash
# En VPS
pm2 list
# → 9001app2-backend [online]

curl http://localhost:5000/api/health
# → {"status":"ok","timestamp":"..."}
```

### **D) Server Frontend Static** 🎨
```bash
# En VPS
curl -I http://localhost/
# → HTTP/1.1 200 OK (Nginx sirviendo estáticos)

curl -I http://localhost/api/health  
# → HTTP/1.1 200 OK (proxy a backend)
```

### **E) External Access** 🌍
```bash
# Desde tu PC local
curl -I http://31.97.162.229/
# → HTTP/1.1 200 OK

# Browser test
# http://31.97.162.229 → SPA carga y navegación funciona
```

---

## 🔄 ESTRATEGIA DE ROLLBACK

### **Frontend Rollback**
```bash
# Estructura propuesta
/var/www/9001app2/
├── releases/
│   ├── 20250107-143052/dist/  # Release anterior
│   ├── 20250107-150030/dist/  # Release actual
│   └── 20250107-152145/dist/  # Release nuevo
├── current -> releases/20250107-150030/dist/  # Symlink
└── previous -> releases/20250107-143052/dist/ # Backup

# Rollback comando
ln -sfn /var/www/9001app2/previous /var/www/9001app2/current
systemctl reload nginx
```

### **Backend Rollback**
```bash
# PM2 rollback
pm2 resurrect  # Restore previous saved state

# O manual restart con backup
cd /root/9001app2-backup
pm2 start ecosystem.config.cjs --name 9001app2-backend
```

### **Config Rollback**
```bash
# Nginx config backup
cp /etc/nginx/sites-available/9001app2 /etc/nginx/sites-available/9001app2.bak

# Restore
cp /etc/nginx/sites-available/9001app2.bak /etc/nginx/sites-available/9001app2
nginx -t && systemctl reload nginx
```

---

## 📊 MONITOREO Y LOGS

### **Health Monitoring**
```bash
# Endpoints de salud
curl http://31.97.162.229/api/health        # Backend health
curl -I http://31.97.162.229/               # Frontend health

# PM2 status
pm2 list
pm2 logs 9001app2-backend --lines 50
```

### **Log Locations**
- **Deploy logs**: `/root/deploy.log`
- **Backend logs**: `pm2 logs 9001app2-backend`
- **Nginx access**: `/var/log/nginx/access.log`
- **Nginx error**: `/var/log/nginx/error.log`

### **Opcional: Uptime Kuma**
```bash
# Instalar Uptime Kuma para monitoring externo
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data louislam/uptime-kuma:1

# Configurar checks:
# - HTTP: http://31.97.162.229/
# - HTTP: http://31.97.162.229/api/health
```

---

## 🚨 RIESGOS Y MITIGACIONES

### **Riesgo 1: Node 20 rompe backend**
- **Mitigación**: Probar local primero, agendar mantenimiento
- **Rollback**: Node 18 + `pm2 resurrect`

### **Riesgo 2: GitLab CI sin credenciales**
- **Mitigación**: Usar Deploy Key/Token, validar con shadow mode
- **Rollback**: Continuar con deploy manual hasta resolver

### **Riesgo 3: Nginx sin permisos a estáticos**
- **Mitigación**: Mantener `/var/www/9001app2/dist` + `chown www-data`
- **Rollback**: Symlink a release anterior

### **Riesgo 4: PM2 inconsistente**
- **Mitigación**: Evitar `stop all`, usar `reload` por nombre, `pm2 save`
- **Rollback**: `pm2 resurrect` o restart manual

### **Riesgo 5: Cron interfiere con CI**
- **Mitigación**: Deshabilitar cron solo cuando CI funcione
- **Rollback**: Reactivar cron si CI falla

---

## 📅 CRONOGRAMA PROPUESTO

### **Semana 1** (Actual)
- [x] **Día 1**: Etapa 0 + Etapa 1 ✅ *COMPLETADO*
- [ ] **Día 2**: `.gitlab-ci.yml` shadow mode
- [ ] **Día 3**: Validar shadow, activar CI live

### **Semana 2**
- [ ] **Lunes**: Pruebas locales Node 20
- [ ] **Miércoles**: Upgrade Node 20 en servidor (ventana mantenimiento)
- [ ] **Viernes**: Verificación y optimizaciones

### **Semana 3**
- [ ] **Lunes**: Usuario deployer + permisos
- [ ] **Miércoles**: Logrotate + monitoreo básico
- [ ] **Viernes**: Documentación final

### **Semana 4**
- [ ] **Lunes**: Login/autenticación frontend estable
- [ ] **Miércoles**: Menú lateral + rutas protegidas
- [ ] **Viernes**: ABM Departamentos piloto

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### **HOY** (Usuario + Asistente)
1. **Asistente**: Crear `.gitlab-ci.yml` en modo shadow
2. **Usuario**: Revisar archivo, commit y push
3. **Usuario**: Configurar variables SSH en GitLab
4. **Usuario**: Ejecutar pipeline shadow manualmente
5. **Verificar**: Conectividad y validaciones OK

### **MAÑANA**
1. **Usuario**: Activar CI en modo live (manual trigger)
2. **Usuario**: Deshabilitar cron si existe
3. **Asistente**: Preparar strategy de releases/symlinks
4. **Verificar**: Deploy automático funciona

### **ESTA SEMANA**
1. Node 20 testing local
2. Rollback strategy implementation
3. Basic monitoring setup

---

## 📞 CONTACTO Y SOPORTE

**Para problemas o consultas**:
1. **Logs inmediatos**: `tail -f /root/deploy.log`
2. **Estado servicios**: `pm2 list && systemctl status nginx`
3. **Connectivity**: `curl -I http://31.97.162.229/api/health`

**Escalación**:
- Rollback automático si health checks fallan
- Documentación paso a paso para cada escenario
- Checkpoints claros entre usuario y asistente

---

**Última actualización**: 2025-01-07  
**Versión**: 1.0.0  
**Estado**: ✅ Etapas 0-1 completadas, Etapa 2 lista para implementar
