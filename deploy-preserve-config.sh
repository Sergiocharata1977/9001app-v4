#!/bin/bash
set -euo pipefail

# ===============================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO 9001APP2
# CON PRESERVACIÓN DE CONFIGURACIÓN
# ===============================================

echo "🚀 Iniciando despliegue automático con preservación de configuración..."
echo "📅 Fecha: $(date)"
echo "=============================================="

# Variables
PROJECT_DIR="/root/9001app2"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
STATIC_ROOT="/var/www/9001app2"
STATIC_DIR="$STATIC_ROOT/dist"
LOG_FILE="/root/deploy.log"
CONFIG_BACKUP_DIR="/root/9001app2-config-backup"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Función de error
error() {
    log "❌ ERROR: $1"
    exit 1
}

# Verificar que estamos en el directorio correcto
if [ ! -d "$PROJECT_DIR" ]; then
    error "Directorio del proyecto no encontrado: $PROJECT_DIR"
fi

log "📁 Navegando a: $PROJECT_DIR"
cd $PROJECT_DIR || error "No se pudo acceder al directorio del proyecto"

# ===============================================
# PASO 1: BACKUP DE CONFIGURACIONES EXISTENTES
# ===============================================
log "💾 Respaldando configuraciones existentes..."
mkdir -p "$CONFIG_BACKUP_DIR"

# Respaldar configuración del servidor si existe
if [ -f "$STATIC_DIR/runtime-config.override.js" ]; then
    cp "$STATIC_DIR/runtime-config.override.js" "$CONFIG_BACKUP_DIR/runtime-config.override.js"
    log "✅ Configuración runtime-config.override.js respaldada"
fi

# Respaldar .env del backend si existe
if [ -f "$BACKEND_DIR/.env" ]; then
    cp "$BACKEND_DIR/.env" "$CONFIG_BACKUP_DIR/backend.env"
    log "✅ Archivo .env del backend respaldado"
fi

# ===============================================
# PASO 2: ACTUALIZAR CÓDIGO DESDE GITLAB
# ===============================================
log "🔄 Actualizando código desde GitLab..."
git fetch origin
git reset --hard origin/master
git pull origin master

if [ $? -ne 0 ]; then
    error "Error al actualizar desde GitLab"
fi

log "✅ Código actualizado exitosamente"

# ===============================================
# PASO 3: RESTAURAR CONFIGURACIONES
# ===============================================
log "♻️ Restaurando configuraciones del servidor..."

# Restaurar .env del backend
if [ -f "$CONFIG_BACKUP_DIR/backend.env" ]; then
    cp "$CONFIG_BACKUP_DIR/backend.env" "$BACKEND_DIR/.env"
    log "✅ Archivo .env del backend restaurado"
fi

# ===============================================
# PASO 4: FRONTEND - INSTALAR Y CONSTRUIR
# ===============================================
log "🎨 Procesando frontend..."
cd $FRONTEND_DIR || error "No se pudo acceder al directorio frontend"

# Instalar dependencias
log "📦 Instalando dependencias del Frontend..."
npm install --production=false

if [ $? -ne 0 ]; then
    error "Error al instalar dependencias del Frontend"
fi

# Construir para producción
log "🏗️ Construyendo Frontend para producción..."
npm run build

if [ $? -ne 0 ]; then
    error "Error al construir el Frontend"
fi

log "✅ Frontend construido exitosamente"

# ===============================================
# PASO 5: BACKEND - INSTALAR Y CONFIGURAR
# ===============================================
log "⚙️ Procesando Backend..."
cd $BACKEND_DIR || error "No se pudo acceder al directorio Backend"

# Instalar dependencias del backend
log "📦 Instalando dependencias del Backend..."
npm install --production=false

if [ $? -ne 0 ]; then
    error "Error al instalar dependencias del Backend"
fi

log "✅ Backend configurado exitosamente"

# ===============================================
# PASO 6: REINICIAR/RECARGAR BACKEND CON PM2
# ===============================================
log "🔄 Reiniciando/recargando backend con PM2..."
cd $BACKEND_DIR
if pm2 describe "9001app2-backend" >/dev/null 2>&1; then
    pm2 reload "9001app2-backend"
else
    pm2 start ecosystem.config.cjs --name "9001app2-backend"
fi

# ===============================================
# PASO 7: HEALTH CHECK BACKEND
# ===============================================
log "🩺 Verificando salud del backend..."
sleep 2
if curl -fsS http://127.0.0.1:5000/api/health >/dev/null; then
    log "✅ Backend OK"
else
    error "❌ Backend no responde en /api/health. Abortando publicación de frontend"
fi

# ===============================================
# PASO 8: PUBLICAR FRONTEND ESTÁTICO PARA NGINX
# ===============================================
log "📦 Publicando frontend en ${STATIC_DIR}..."
mkdir -p "$STATIC_DIR"
rsync -a --delete "$FRONTEND_DIR/dist/" "$STATIC_DIR/"

# Copiar archivos de configuración adicionales desde public/
log "📋 Copiando archivos de configuración..."
cp "$FRONTEND_DIR/public/runtime-config.js" "$STATIC_DIR/" 2>/dev/null || log "⚠️ runtime-config.js no encontrado en public/"

# ===============================================
# PASO 9: RESTAURAR CONFIGURACIÓN DEL SERVIDOR
# ===============================================
if [ -f "$CONFIG_BACKUP_DIR/runtime-config.override.js" ]; then
    cp "$CONFIG_BACKUP_DIR/runtime-config.override.js" "$STATIC_DIR/runtime-config.override.js"
    log "✅ Configuración runtime-config.override.js restaurada en producción"
else
    # Si no existe, crear una configuración por defecto para el servidor
    log "📝 Creando configuración por defecto para el servidor..."
    cat > "$STATIC_DIR/runtime-config.override.js" << 'EOF'
// Configuración específica del servidor VPS
window.__RUNTIME_CONFIG__ = {
  ...window.__RUNTIME_CONFIG__,
  API_BASE_URL: 'http://31.97.162.229:5000/api',
  API_URL: 'http://31.97.162.229:5000/api',
  APP_NAME: 'ISO Flow',
  APP_VERSION: '1.0.0',
  AUTH_ENABLED: true,
  TOKEN_KEY: 'iso_auth_token'
};
EOF
    log "✅ Configuración por defecto creada"
fi

# Asegurar permisos correctos
chown -R www-data:www-data "$STATIC_ROOT" 2>/dev/null || true

# ===============================================
# PASO 10: RECARGAR NGINX
# ===============================================
log "🔁 Validando y recargando Nginx..."
if nginx -t; then
    systemctl reload nginx
    log "✅ Nginx recargado"
else
    error "❌ Configuración de Nginx inválida"
fi

# ===============================================
# PASO 11: VERIFICAR ESTADO FINAL
# ===============================================
log "🔍 Verificando estado de servicios..."
if pm2 list | grep -q "9001app2-backend.*online"; then
    log "✅ Backend funcionando correctamente"
else
    error "❌ Backend no está funcionando"
fi

if curl -fsS http://127.0.0.1/ >/dev/null; then
    log "✅ Frontend servido por Nginx en puerto 80"
else
    log "⚠️ Frontend podría tardar en estar disponible"
fi

# ===============================================
# PASO 12: VERIFICAR CONFIGURACIÓN
# ===============================================
log "🔍 Verificando configuración del frontend..."
if [ -f "$STATIC_DIR/runtime-config.js" ]; then
    log "✅ runtime-config.js presente"
fi

if [ -f "$STATIC_DIR/runtime-config.override.js" ]; then
    log "✅ runtime-config.override.js presente"
    log "📋 Contenido de la configuración:"
    cat "$STATIC_DIR/runtime-config.override.js" | head -20
fi

# ===============================================
# PASO 13: LIMPIAR LOGS ANTIGUOS
# ===============================================
find /root -name "*.log" -mtime +7 -delete 2>/dev/null

# ===============================================
# PASO 14: RESUMEN FINAL
# ===============================================
log "🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE"
log "📊 Resumen:"
log "   - Frontend: http://31.97.162.229/"
log "   - Backend: http://31.97.162.229:5000"
log "   - Configuración preservada: ✅"
log "   - Logs: $LOG_FILE"
log "=============================================="

echo "✅ Despliegue completado en $(date)"
echo ""
echo "🔧 NOTA IMPORTANTE:"
echo "La configuración del servidor se ha preservado automáticamente."
echo "Si necesitas cambiar las URLs de la API, edita:"
echo "  $STATIC_DIR/runtime-config.override.js"
echo ""
