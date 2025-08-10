#!/bin/bash
set -euo pipefail

# ===============================================
# SCRIPT DE DESPLIEGUE LOCAL A SERVIDOR
# 9001APP2 - Refactorización Vite
# ===============================================

echo "🚀 Iniciando despliegue desde local a servidor..."
echo "📅 Fecha: $(date)"
echo "=============================================="

# Variables de configuración
SERVER_IP="31.97.162.229"
SERVER_USER="root"
PROJECT_NAME="9001app2"
LOCAL_PROJECT_DIR="$(pwd)"
REMOTE_PROJECT_DIR="/root/9001app2"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de logging con colores
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    exit 1
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    error "No se detectó un proyecto válido. Ejecuta desde el directorio raíz del proyecto."
fi

log "📁 Directorio actual: $LOCAL_PROJECT_DIR"

# 1. COMMIT Y PUSH A GITLAB
log "🔄 Subiendo cambios a GitLab..."

# Verificar si hay cambios
if git diff --quiet && git diff --cached --quiet; then
    warning "No hay cambios para commitear"
else
    git add .
    git commit -m "deploy: actualización automática $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin master
    
    if [ $? -ne 0 ]; then
        error "Error al hacer push a GitLab"
    fi
    success "Cambios subidos a GitLab"
fi

# 2. CONECTAR AL SERVIDOR Y EJECUTAR DESPLIEGUE
log "🌐 Conectando al servidor $SERVER_IP..."

# Crear script temporal para el servidor
cat > /tmp/server-deploy.sh << 'EOF'
#!/bin/bash
set -euo pipefail

# Variables del servidor
PROJECT_DIR="/root/9001app2"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
STATIC_ROOT="/var/www/9001app2"
STATIC_DIR="$STATIC_ROOT/dist"
LOG_FILE="/root/deploy.log"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

error() {
    log "❌ ERROR: $1"
    exit 1
}

log "🔄 Iniciando despliegue en servidor..."

# Navegar al proyecto
cd $PROJECT_DIR || error "Directorio del proyecto no encontrado"

# Actualizar desde GitLab
log "📥 Actualizando código desde GitLab..."
git fetch origin
git reset --hard origin/master
git pull origin master

if [ $? -ne 0 ]; then
    error "Error al actualizar desde GitLab"
fi

# Frontend
log "🎨 Procesando Frontend..."
cd $FRONTEND_DIR || error "No se pudo acceder al Frontend"

npm install --production=false
npm run build

if [ $? -ne 0 ]; then
    error "Error al construir Frontend"
fi

# Backend
log "⚙️ Procesando Backend..."
cd $BACKEND_DIR || error "No se pudo acceder al Backend"

npm install --production=false

# Reiniciar/recargar backend via PM2
log "🔄 Reiniciando/recargando backend..."
if pm2 describe "9001app2-backend" >/dev/null 2>&1; then
    pm2 reload "9001app2-backend"
else
    pm2 start ecosystem.config.cjs --name "9001app2-backend"
fi

# Health check backend
log "🩺 Verificando salud del backend..."
sleep 2
curl -fsS http://127.0.0.1:5000/api/health >/dev/null || error "Backend no saludable"

# Publicar frontend para Nginx
log "📦 Publicando frontend en ${STATIC_DIR}..."
mkdir -p "$STATIC_DIR"
rsync -a --delete "$FRONTEND_DIR/dist/" "$STATIC_DIR/"
chown -R www-data:www-data "$STATIC_ROOT" 2>/dev/null || true

# Recargar Nginx
log "🔁 Recargando Nginx..."
nginx -t && systemctl reload nginx

log "✅ Despliegue completado en servidor"
EOF

# Subir script al servidor y ejecutarlo
scp /tmp/server-deploy.sh $SERVER_USER@$SERVER_IP:/tmp/
ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/server-deploy.sh && /tmp/server-deploy.sh"

if [ $? -ne 0 ]; then
    error "Error en el despliegue del servidor"
fi

# Limpiar archivo temporal
rm /tmp/server-deploy.sh

# 3. VERIFICAR DESPLIEGUE
log "🔍 Verificando despliegue..."

sleep 10

# Verificar que el servidor responde por Nginx
if curl -s http://$SERVER_IP/ > /dev/null; then
    success "Frontend funcionando en http://$SERVER_IP/"
else
    warning "Frontend puede tardar en estar disponible"
fi

# 4. RESUMEN FINAL
echo ""
echo "=============================================="
success "DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "📊 Resumen:"
echo "   - Repositorio: GitLab actualizado"
echo "   - Servidor: $SERVER_IP"
echo "   - Frontend: http://$SERVER_IP:3000"
echo "   - Backend: Puerto 5000"
echo "   - Logs: /root/deploy.log en servidor"
echo "=============================================="

success "¡Despliegue completado en $(date)!" 