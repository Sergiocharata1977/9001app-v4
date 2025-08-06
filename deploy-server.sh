#!/bin/bash

# ===============================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO ISO FLOW
# ===============================================

echo "🚀 Iniciando despliegue automático..."
echo "📅 Fecha: $(date)"
echo "=============================================="

# Variables
PROJECT_DIR="/root/9001app2"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
LOG_FILE="/root/deploy.log"

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

# 1. ACTUALIZAR CÓDIGO DESDE GITLAB
log "🔄 Actualizando código desde GitLab..."
git fetch origin
git reset --hard origin/master
git pull origin master

if [ $? -ne 0 ]; then
    error "Error al actualizar desde GitLab"
fi

log "✅ Código actualizado exitosamente"

# 2. FRONTEND - INSTALAR Y CONSTRUIR
log "🎨 Procesando Frontend..."
cd $FRONTEND_DIR || error "No se pudo acceder al directorio Frontend"

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

# 3. BACKEND - INSTALAR Y CONFIGURAR
log "⚙️ Procesando Backend..."
cd $BACKEND_DIR || error "No se pudo acceder al directorio Backend"

# Instalar dependencias del backend
log "📦 Instalando dependencias del Backend..."
npm install --production=false

if [ $? -ne 0 ]; then
    error "Error al instalar dependencias del Backend"
fi

# Verificar variables de entorno
if [ ! -f ".env" ]; then
    log "⚠️ Archivo .env no encontrado, copiando desde ejemplo..."
    cp .env.example .env 2>/dev/null || log "⚠️ No se encontró .env.example"
fi

log "✅ Backend configurado exitosamente"

# 4. REINICIAR SERVICIOS
log "🔄 Reiniciando servicios..."

# Detener servicios existentes
pm2 stop all 2>/dev/null
pm2 delete all 2>/dev/null

# Iniciar backend
log "🚀 Iniciando Backend..."
cd $BACKEND_DIR
pm2 start ecosystem.config.cjs --name "isoflow-backend"

# Iniciar frontend (servir archivos estáticos)
log "🌐 Iniciando Frontend..."
cd $FRONTEND_DIR
npx serve -s dist -l 3000 --host 0.0.0.0 --name "isoflow-frontend" &

# 5. VERIFICAR ESTADO
sleep 5
log "🔍 Verificando estado de servicios..."

# Verificar backend
if pm2 list | grep -q "isoflow-backend.*online"; then
    log "✅ Backend funcionando correctamente"
else
    error "❌ Backend no está funcionando"
fi

# Verificar frontend
if curl -s http://localhost:3000 > /dev/null; then
    log "✅ Frontend funcionando correctamente"
else
    log "⚠️ Frontend puede tardar en iniciar"
fi

# 6. LIMPIAR LOGS ANTIGUOS
find /root -name "*.log" -mtime +7 -delete 2>/dev/null

# 7. RESUMEN FINAL
log "🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE"
log "📊 Resumen:"
log "   - Frontend: http://31.97.162.229:3000"
log "   - Backend: Puerto 5000"
log "   - Logs: $LOG_FILE"
log "=============================================="

echo "✅ Despliegue completado en $(date)" 