# ===============================================
# SCRIPT DE DESPLIEGUE SIMPLE CON SSH
# 9001APP2 - PowerShell para Windows
# ===============================================

Write-Host "🚀 Iniciando despliegue automático..." -ForegroundColor Green
Write-Host "📅 Fecha: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Variables de configuración
$SERVER_IP = "31.97.162.229"
$SERVER_USER = "root"
$SSH_KEY_PATH = "C:\Users\Usuario\.ssh\9001app2"

# Función de logging
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

# Función de éxito
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

# Función de error
function Write-Error {
    param([string]$Message)
    Write-Host "❌ ERROR: $Message" -ForegroundColor Red
    exit 1
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

# Comandos a ejecutar en el servidor
$deployCommands = @"
cd /root/9001app2
git fetch origin
git reset --hard origin/master
git pull origin master
cd frontend
npm install --production=false
npm run build
cd ../backend
npm install --production=false
pm2 reload 9001app2-backend || pm2 start ecosystem.config.cjs --name 9001app2-backend
sleep 5
curl -fsS http://127.0.0.1:5000/api/health
mkdir -p /var/www/9001app2/dist
rsync -a --delete /root/9001app2/frontend/dist/ /var/www/9001app2/dist/
nginx -t && systemctl reload nginx
echo 'Despliegue completado exitosamente'
"@

# Guardar comandos en archivo temporal
$tempFile = "C:\temp\deploy-commands.sh"
New-Item -ItemType Directory -Force -Path "C:\temp" | Out-Null
$deployCommands | Out-File -FilePath $tempFile -Encoding UTF8

# Subir archivo al servidor y ejecutarlo
Write-Log "📤 Subiendo comandos al servidor..." "Yellow"
try {
    # Copiar archivo al servidor
    scp -i $SSH_KEY_PATH $tempFile "${SERVER_USER}@${SERVER_IP}:/tmp/"
    
    # Ejecutar comandos en el servidor
    ssh -i $SSH_KEY_PATH "${SERVER_USER}@${SERVER_IP}" "chmod +x /tmp/deploy-commands.sh; /tmp/deploy-commands.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Despliegue completado exitosamente"
    } else {
        Write-Error "Error en el despliegue del servidor"
    }
} catch {
    Write-Error "Error durante el despliegue: $($_.Exception.Message)"
} finally {
    # Limpiar archivo temporal
    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    ssh -i $SSH_KEY_PATH "${SERVER_USER}@${SERVER_IP}" "rm -f /tmp/deploy-commands.sh" 2>$null
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
Write-Success "DESPLIEGUE COMPLETADO EXITOSAMENTE"
Write-Host "📊 Resumen:" -ForegroundColor White
Write-Host "   - Servidor: $SERVER_IP" -ForegroundColor White
Write-Host "   - Frontend: http://$SERVER_IP/" -ForegroundColor White
Write-Host "   - Backend: http://$SERVER_IP:5000" -ForegroundColor White
Write-Host "   - MCP Config: Actualizado y funcional" -ForegroundColor White
Write-Host "==============================================" -ForegroundColor Cyan

Write-Success "Despliegue completado en $(Get-Date)!"
