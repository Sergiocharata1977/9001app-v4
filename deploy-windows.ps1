# ===============================================
# SCRIPT DE DESPLIEGUE DESDE WINDOWS
# 9001APP2 - PowerShell para Windows
# ===============================================

Write-Host "🚀 Iniciando despliegue desde Windows..." -ForegroundColor Green
Write-Host "📅 Fecha: $(Get-Date)" -ForegroundColor Cyan
Write-Host "🌐 Servidor: 31.97.162.229" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Variables de configuración
$SERVER_IP = "31.97.162.229"
$SERVER_USER = "root"
$SSH_KEY_PATH = "C:\Users\Usuario\.ssh\9001app2"
$PROJECT_DIR = "/root/9001app2"
$DEPLOY_SCRIPT = "deploy-automated.sh"

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

# Función de advertencia
function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
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

# 2. SUBIR SCRIPT DE DESPLIEGUE AL SERVIDOR
Write-Log "📤 Subiendo script de despliegue al servidor..." "Yellow"
try {
    # Copiar script al servidor
    scp -i $SSH_KEY_PATH $DEPLOY_SCRIPT "${SERVER_USER}@${SERVER_IP}:/tmp/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Script subido exitosamente"
    } else {
        Write-Error "Error al subir script al servidor"
    }
} catch {
    Write-Error "Error durante la subida del script: $($_.Exception.Message)"
}

# 3. EJECUTAR DESPLIEGUE EN EL SERVIDOR
Write-Log "🚀 Ejecutando despliegue en el servidor..." "Cyan"
try {
    # Dar permisos de ejecución y ejecutar
    ssh -i $SSH_KEY_PATH "${SERVER_USER}@${SERVER_IP}" "chmod +x /tmp/$DEPLOY_SCRIPT; /tmp/$DEPLOY_SCRIPT"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Despliegue completado exitosamente"
    } else {
        Write-Error "Error en el despliegue del servidor"
    }
} catch {
    Write-Error "Error durante el despliegue: $($_.Exception.Message)"
}

# 4. LIMPIAR ARCHIVOS TEMPORALES
Write-Log "🧹 Limpiando archivos temporales..." "Yellow"
try {
    ssh -i $SSH_KEY_PATH "${SERVER_USER}@${SERVER_IP}" "rm -f /tmp/$DEPLOY_SCRIPT"
    Write-Success "Archivos temporales limpiados"
} catch {
    Write-Warning "No se pudieron limpiar archivos temporales"
}

# 5. VERIFICAR DESPLIEGUE
Write-Log "🔍 Verificando despliegue..." "Cyan"
Start-Sleep -Seconds 5

# Verificar backend
try {
    $healthCheck = Invoke-WebRequest -Uri "http://$SERVER_IP:5000/api/health" -TimeoutSec 10
    if ($healthCheck.StatusCode -eq 200) {
        Write-Success "Backend API funcionando correctamente"
    } else {
        Write-Warning "Backend puede tardar en estar disponible"
    }
} catch {
    Write-Warning "Backend puede tardar en estar disponible"
}

# Verificar frontend
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://$SERVER_IP/" -TimeoutSec 10
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Success "Frontend funcionando correctamente"
    } else {
        Write-Warning "Frontend puede tardar en estar disponible"
    }
} catch {
    Write-Warning "Frontend puede tardar en estar disponible"
}

# 6. RESUMEN FINAL
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Success "DESPLIEGUE COMPLETADO EXITOSAMENTE"
Write-Host "📊 Resumen:" -ForegroundColor White
Write-Host "   - Servidor: $SERVER_IP" -ForegroundColor White
Write-Host "   - Frontend: http://$SERVER_IP/" -ForegroundColor White
Write-Host "   - Backend: http://$SERVER_IP:5000" -ForegroundColor White
Write-Host "   - API Health: http://$SERVER_IP:5000/api/health" -ForegroundColor White
Write-Host "   - SSH Key: $SSH_KEY_PATH" -ForegroundColor White
Write-Host "==============================================" -ForegroundColor Cyan

Write-Success "Despliegue completado en $(Get-Date)!"

# 7. MOSTRAR COMANDOS ÚTILES
Write-Host ""
Write-Host "🔧 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   - Ver logs: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_IP 'tail -f /root/deploy-*.log'" -ForegroundColor Gray
Write-Host "   - Estado PM2: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_IP 'pm2 list'" -ForegroundColor Gray
Write-Host "   - Reiniciar PM2: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_IP 'pm2 restart 9001app2-backend'" -ForegroundColor Gray
Write-Host "   - Ver logs PM2: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_IP 'pm2 logs 9001app2-backend'" -ForegroundColor Gray
