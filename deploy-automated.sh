#!/bin/bash
set -euo pipefail

# ===============================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO OPTIMIZADO
# 9001APP2 - Hostinger VPS
# ===============================================

echo "🚀 Iniciando despliegue automático optimizado..."
echo "📅 Fecha: $(date)"
echo "🌐 Servidor: 31.97.162.229"
echo "=============================================="

# Variables de configuración
PROJECT_DIR="/root/9001app2"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
STATIC_ROOT="/var/www/9001app2"
STATIC_DIR="$STATIC_ROOT/dist"
LOG_FILE="/root/deploy-$(date +%Y%m%d_%H%M%S).log"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Función de error
error() {
    log "❌ ERROR: $1"
    exit 1
}

# Función de éxito
success() {
    log "✅ $1"
}

# Función de advertencia
warning() {
    log "⚠️ $1"
}

# Verificar directorio del proyecto
if [ ! -d "$PROJECT_DIR" ]; then
    error "Directorio del proyecto no encontrado: $PROJECT_DIR"
fi

log "📁 Navegando a: $PROJECT_DIR"
cd $PROJECT_DIR || error "No se pudo acceder al directorio del proyecto"

# 1. BACKUP RÁPIDO (opcional)
log "💾 Creando backup rápido..."
if [ -d "$FRONTEND_DIR/dist" ]; then
    cp -r "$FRONTEND_DIR/dist" "/tmp/frontend-backup-$(date +%Y%m%d_%H%M%S)" 2>/dev/null || warning "No se pudo crear backup del frontend"
fi

# 2. ACTUALIZAR CÓDIGO DESDE GITHUB
log "🔄 Actualizando código desde GitHub..."
git fetch origin
git reset --hard origin/main
git pull origin main

if [ $? -ne 0 ]; then
    error "Error al actualizar desde GitHub"
fi

success "Código actualizado exitosamente"

# 3. FRONTEND - INSTALAR Y CONSTRUIR
log "🎨 Procesando Frontend..."
cd $FRONTEND_DIR || error "No se pudo acceder al directorio Frontend"

# Limpiar cache de npm si es necesario
if [ -d "node_modules/.cache" ]; then
    log "🧹 Limpiando cache de npm..."
    rm -rf node_modules/.cache
fi

# Instalar dependencias
log "📦 Instalando dependencias del Frontend..."
npm ci --production=false || npm install --production=false

if [ $? -ne 0 ]; then
    error "Error al instalar dependencias del Frontend"
fi

# Construir para producción
log "🏗️ Construyendo Frontend para producción..."
npm run build

if [ $? -ne 0 ]; then
    error "Error al construir el Frontend"
fi

success "Frontend construido exitosamente"

# 4. BACKEND - INSTALAR Y CONFIGURAR
log "⚙️ Procesando Backend..."
cd $BACKEND_DIR || error "No se pudo acceder al directorio Backend"

# Instalar dependencias del backend
log "📦 Instalando dependencias del Backend..."
npm ci --production=false || npm install --production=false

if [ $? -ne 0 ]; then
    error "Error al instalar dependencias del Backend"
fi

# Verificar variables de entorno
if [ ! -f ".env" ]; then
    log "⚠️ Archivo .env no encontrado, copiando desde ejemplo..."
    cp .env.example .env 2>/dev/null || warning "No se encontró .env.example"
fi

success "Backend configurado exitosamente"

# 5. REINICIAR BACKEND CON PM2
log "🔄 Reiniciando backend con PM2..."
cd $BACKEND_DIR

# Verificar si PM2 está funcionando
if ! command -v pm2 &> /dev/null; then
    error "PM2 no está instalado"
fi

# Reiniciar o iniciar la aplicación
if pm2 describe "9001app2-backend" >/dev/null 2>&1; then
    log "🔄 Recargando aplicación existente..."
    pm2 reload "9001app2-backend"
else
    log "🚀 Iniciando nueva aplicación..."
    pm2 start ecosystem.config.cjs --name "9001app2-backend"
fi

# 6. HEALTH CHECK BACKEND
log "🩺 Verificando salud del backend..."
sleep 3

# Intentar health check varias veces
for i in {1..5}; do
    if curl -fsS http://127.0.0.1:5000/api/health >/dev/null; then
        success "Backend OK - Health check exitoso"
        break
    else
        if [ $i -eq 5 ]; then
            error "Backend no responde después de 5 intentos"
        else
            log "⏳ Intento $i/5 - Esperando..."
            sleep 2
        fi
    fi
done

# 7. PUBLICAR FRONTEND ESTÁTICO
log "📦 Publicando frontend en ${STATIC_DIR}..."
mkdir -p "$STATIC_DIR"
rsync -a --delete "$FRONTEND_DIR/dist/" "$STATIC_DIR/"

# Ajustar permisos
chown -R www-data:www-data "$STATIC_ROOT" 2>/dev/null || true
chmod -R 755 "$STATIC_DIR" 2>/dev/null || true

success "Frontend publicado exitosamente"

# 8. RECARGAR NGINX
log "🔁 Validando y recargando Nginx..."
if nginx -t; then
    systemctl reload nginx
    success "Nginx recargado"
else
    error "Configuración de Nginx inválida"
fi

# 9. VERIFICACIÓN FINAL
log "🔍 Verificación final de servicios..."

# Verificar PM2
if pm2 list | grep -q "9001app2-backend.*online"; then
    success "Backend funcionando correctamente en PM2"
else
    error "Backend no está funcionando en PM2"
fi

# Verificar frontend
if curl -fsS http://127.0.0.1/ >/dev/null; then
    success "Frontend servido por Nginx en puerto 80"
else
    warning "Frontend podría tardar en estar disponible"
fi

# Verificar API
if curl -fsS http://127.0.0.1:5000/api/health >/dev/null; then
    success "API backend respondiendo correctamente"
else
    error "API backend no responde"
fi

# 10. LIMPIEZA
log "🧹 Limpiando archivos temporales..."
rm -rf /tmp/frontend-backup-* 2>/dev/null || true

# Limpiar logs antiguos (mantener solo los últimos 7 días)
find /root -name "deploy-*.log" -mtime +7 -delete 2>/dev/null || true

# 11. RESUMEN FINAL
echo ""
echo "=============================================="
success "DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "📊 Resumen del despliegue:"
echo "   - Servidor: 31.97.162.229"
echo "   - Frontend: http://31.97.162.229/"
echo "   - Backend: http://31.97.162.229:5000"
echo "   - API Health: http://31.97.162.229:5000/api/health"
echo "   - Log: $LOG_FILE"
echo "   - PM2 Status: $(pm2 list | grep 9001app2-backend | awk '{print $10}')"
echo "=============================================="

success "Despliegue completado en $(date)"

# Mostrar estado final de PM2
echo ""
echo "📋 Estado de PM2:"
pm2 list | grep 9001app2-backend || echo "No se encontró la aplicación en PM2"
