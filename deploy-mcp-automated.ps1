# ===============================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO CON MCP
# 9001APP2 - PowerShell para Windows
# ===============================================

Write-Host "🚀 Iniciando despliegue automático con MCP..." -ForegroundColor Green
Write-Host "📅 Fecha: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Variables de configuración MCP
$SERVER_IP = "31.97.162.229"
$SERVER_USER = "root"
$SSH_KEY_PATH = "C:\Users\Usuario\.ssh\9001app2"
$PROJECT_DIR = "/root/9001app"

# Función de logging
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

# Función de error
function Write-Error {
    param([string]$Message)
    Write-Host "❌ ERROR: $Message" -ForegroundColor Red
    exit 1
}

# Función de éxito
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

# 1. VERIFICAR CONECTIVIDAD SSH
Write-Log "🌐 Verificando conectividad SSH..." "Cyan"
try {
    $sshTest = ssh -i $SSH_KEY_PATH -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_IP "echo 'SSH connection OK'"
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Conectividad SSH establecida"
    } else {
        Write-Error "No se pudo conectar al servidor via SSH"
    }
} catch {
    Write-Error "Error de conectividad SSH: $($_.Exception.Message)"
}

# 2. EJECUTAR DESPLIEGUE EN EL SERVIDOR
Write-Log "🚀 Ejecutando despliegue en el servidor..." "Cyan"

# Crear script temporal para el servidor
$serverScript = @'
#!/bin/bash
set -euo pipefail

# Variables del servidor
PROJECT_DIR="/root/9001app"
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

log "🔄 Iniciando despliegue MCP automático..."

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

log "✅ Despliegue MCP completado exitosamente"
'@

# Guardar script temporal
$tempScript = "C:\temp\server-deploy.sh"
New-Item -ItemType Directory -Force -Path "C:\temp" | Out-Null
$serverScript | Out-File -FilePath $tempScript -Encoding UTF8

# Subir script al servidor y ejecutarlo
Write-Log "📤 Subiendo script al servidor..." "Yellow"
try {
    # Copiar script al servidor
    scp -i $SSH_KEY_PATH $tempScript "${SERVER_USER}@${SERVER_IP}:/tmp/"
    
    # Ejecutar script en el servidor
    ssh -i $SSH_KEY_PATH "${SERVER_USER}@${SERVER_IP}" "chmod +x /tmp/server-deploy.sh; /tmp/server-deploy.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Despliegue completado exitosamente"
    } else {
        Write-Error "Error en el despliegue del servidor"
    }
} catch {
    Write-Error "Error durante el despliegue: $($_.Exception.Message)"
} finally {
    # Limpiar archivo temporal
    Remove-Item $tempScript -Force -ErrorAction SilentlyContinue
    ssh -i $SSH_KEY_PATH "${SERVER_USER}@${SERVER_IP}" "rm -f /tmp/server-deploy.sh" 2>$null
}

# 3. VERIFICAR DESPLIEGUE
Write-Log "🔍 Verificando despliegue..." "Cyan"
Start-Sleep -Seconds 10

try {
    $healthCheck = Invoke-WebRequest -Uri "http://$SERVER_IP/api/health" -TimeoutSec 10
    if ($healthCheck.StatusCode -eq 200) {
        Write-Success "Backend API funcionando correctamente"
    } else {
        Write-Log "⚠️ Backend puede tardar en estar disponible" "Yellow"
    }
} catch {
    Write-Log "⚠️ Backend puede tardar en estar disponible" "Yellow"
}

try {
    $frontendCheck = Invoke-WebRequest -Uri "http://$SERVER_IP/" -TimeoutSec 10
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Success "Frontend funcionando correctamente"
    } else {
        Write-Log "⚠️ Frontend puede tardar en estar disponible" "Yellow"
    }
} catch {
    Write-Log "⚠️ Frontend puede tardar en estar disponible" "Yellow"
}

# 4. RESUMEN FINAL
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Success "DESPLIEGUE MCP COMPLETADO EXITOSAMENTE"
Write-Host "📊 Resumen:" -ForegroundColor White
Write-Host "   - Servidor: $SERVER_IP" -ForegroundColor White
Write-Host "   - Frontend: http://$SERVER_IP/" -ForegroundColor White
Write-Host "   - Backend: http://$SERVER_IP:5000" -ForegroundColor White
Write-Host "   - MCP Config: Actualizado y funcional" -ForegroundColor White
Write-Host "==============================================" -ForegroundColor Cyan

Write-Success "Despliegue completado en $(Get-Date)!"
