m run dev#!/bin/bash
set -euo pipefail

# ===============================================
# SCRIPT DE VERIFICACIÓN PREVIA AL DESPLIEGUE
# 9001APP2 - Verificación de prerequisitos del servidor
# ===============================================

echo "🔍 Verificando prerequisitos del servidor antes del despliegue..."
echo "📅 Fecha: $(date)"
echo "=============================================="

# Variables de configuración
SERVER_IP="31.97.162.229"
SERVER_USER="root"
PROJECT_DIR="/root/9001app2"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de logging
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

# Verificar conectividad básica
log "🌐 Verificando conectividad al servidor..."
if ping -c 3 $SERVER_IP > /dev/null 2>&1; then
    success "Servidor accesible en $SERVER_IP"
else
    error "No se puede acceder al servidor $SERVER_IP"
fi

# Crear script de verificación para ejecutar en el servidor
cat > /tmp/server-prereq-check.sh << 'EOF'
#!/bin/bash
set -euo pipefail

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

echo "🔧 Verificando prerequisitos del servidor..."

# 1. VERIFICAR NODE.JS
log "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js instalado: $NODE_VERSION"
    
    # Verificar versión mínima (Node 20+)
    NODE_MAJOR=$(node --version | cut -d. -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 20 ]; then
        success "Versión de Node.js compatible (>= 20)"
    else
        warning "Versión de Node.js antigua ($NODE_VERSION). Se recomienda Node 20+"
    fi
else
    error "Node.js NO está instalado. Ejecuta setup-server.sh primero"
fi

# 2. VERIFICAR NPM
log "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "npm instalado: $NPM_VERSION"
else
    error "npm NO está instalado"
fi

# 3. VERIFICAR PM2
log "🔄 Verificando PM2..."
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    success "PM2 instalado: $PM2_VERSION"
else
    warning "PM2 NO está instalado. Se instalará automáticamente"
fi

# 4. VERIFICAR GIT
log "📋 Verificando Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    success "Git instalado: $GIT_VERSION"
else
    error "Git NO está instalado. Ejecuta setup-server.sh primero"
fi

# 5. VERIFICAR NGINX
log "🌐 Verificando Nginx..."
if command -v nginx &> /dev/null; then
    success "Nginx instalado"
    
    # Verificar si está corriendo
    if systemctl is-active --quiet nginx; then
        success "Nginx está activo"
    else
        warning "Nginx NO está activo. Se iniciará durante el despliegue"
    fi
    
    # Verificar configuración
    if nginx -t > /dev/null 2>&1; then
        success "Configuración de Nginx válida"
    else
        error "Configuración de Nginx inválida. Revisa la configuración"
    fi
else
    error "Nginx NO está instalado. Ejecuta setup-server.sh primero"
fi

# 6. VERIFICAR DIRECTORIOS
log "📁 Verificando estructura de directorios..."
PROJECT_DIR="/root/9001app2"

if [ -d "$PROJECT_DIR" ]; then
    success "Directorio del proyecto existe: $PROJECT_DIR"
    
    # Verificar permisos de escritura
    if [ -w "$PROJECT_DIR" ]; then
        success "Permisos de escritura OK en $PROJECT_DIR"
    else
        warning "Sin permisos de escritura en $PROJECT_DIR"
    fi
else
    warning "Directorio del proyecto NO existe. Se creará durante el primer deploy"
    mkdir -p "$PROJECT_DIR" 2>/dev/null || error "No se puede crear directorio $PROJECT_DIR"
    success "Directorio del proyecto creado: $PROJECT_DIR"
fi

# Verificar directorio estático de Nginx
STATIC_DIR="/var/www/9001app2"
if [ ! -d "$STATIC_DIR" ]; then
    warning "Directorio estático NO existe. Creando..."
    mkdir -p "$STATIC_DIR" || error "No se puede crear directorio $STATIC_DIR"
    success "Directorio estático creado: $STATIC_DIR"
fi

# 7. VERIFICAR ESPACIO EN DISCO
log "💾 Verificando espacio en disco..."
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    success "Espacio en disco OK (${DISK_USAGE}% usado)"
else
    warning "Espacio en disco limitado (${DISK_USAGE}% usado). Considera limpiar archivos"
fi

# 8. VERIFICAR MEMORIA
log "🧠 Verificando memoria disponible..."
MEMORY_AVAILABLE=$(free -m | awk 'NR==2{printf "%.1f", $7/$2*100.0}')
if (( $(echo "$MEMORY_AVAILABLE > 20.0" | bc -l) )); then
    success "Memoria disponible OK (${MEMORY_AVAILABLE}%)"
else
    warning "Poca memoria disponible (${MEMORY_AVAILABLE}%). Considera reiniciar servicios"
fi

# 9. VERIFICAR PUERTOS
log "🔌 Verificando puertos disponibles..."

# Puerto 5000 (Backend)
if netstat -tlnp | grep :5000 > /dev/null 2>&1; then
    warning "Puerto 5000 ya está en uso (será reemplazado por PM2)"
else
    success "Puerto 5000 disponible para backend"
fi

# Puerto 80 (Nginx)
if netstat -tlnp | grep :80 > /dev/null 2>&1; then
    success "Puerto 80 en uso por Nginx"
else
    warning "Puerto 80 NO está en uso. Nginx puede no estar configurado"
fi

# 10. VERIFICAR CONECTIVIDAD A GITLAB
log "🔗 Verificando conectividad a GitLab..."
if curl -s --max-time 10 https://gitlab.com > /dev/null; then
    success "Conectividad a GitLab OK"
else
    warning "Problemas de conectividad a GitLab. Verifica conexión a internet"
fi

echo ""
echo "=============================================="
success "VERIFICACIÓN DE PREREQUISITOS COMPLETADA"
echo "El servidor está listo para recibir el despliegue"
echo "=============================================="
EOF

# Ejecutar verificación en el servidor
log "🚀 Ejecutando verificación en el servidor..."
ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/server-prereq-check.sh && /tmp/server-prereq-check.sh"

if [ $? -eq 0 ]; then
    success "Verificación exitosa. El servidor está listo para el despliegue"
    echo ""
    echo "=============================================="
    echo "✅ PREREQUISITOS VERIFICADOS EXITOSAMENTE"
    echo "📊 Servidor: $SERVER_IP"
    echo "👤 Usuario: $SERVER_USER"
    echo "📁 Proyecto: $PROJECT_DIR"
    echo "🌐 Git: https://gitlab.com/late4/9001app2.git"
    echo "=============================================="
    echo ""
    echo "🚀 Puedes proceder con el despliegue usando:"
    echo "   ./deploy-to-server.sh"
    echo ""
else
    error "Verificación falló. Revisa los errores antes de continuar"
fi

# Limpiar archivo temporal
ssh $SERVER_USER@$SERVER_IP "rm -f /tmp/server-prereq-check.sh" 2>/dev/null || true
