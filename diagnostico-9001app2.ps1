# ==========================================
# SCRIPT DE DIAGNÓSTICO AUTOMÁTICO 9001APP2
# Versión: 1.0 - Compatible PowerShell Windows
# ==========================================

param(
    [switch]$Detallado = $false
)

# Configuración
$VPS_IP = "31.97.162.229"
$FRONTEND_PORT = "3000"
$BACKEND_PORT = "5000"

# Función para escribir con colores
function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "INFO"
    )
    
    switch ($Type) {
        "SUCCESS" { Write-Host "✅ $Message" -ForegroundColor Green }
        "ERROR"   { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "⚠️ $Message" -ForegroundColor Yellow }
        "INFO"    { Write-Host "ℹ️ $Message" -ForegroundColor Cyan }
        "TITLE"   { Write-Host "`n🔍 $Message" -ForegroundColor Yellow -BackgroundColor DarkBlue }
    }
}

# Iniciar diagnóstico
Clear-Host
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " DIAGNÓSTICO AUTOMÁTICO 9001APP2" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "VPS: $VPS_IP" -ForegroundColor Gray

# 1. VERIFICAR CONECTIVIDAD
Write-Status "VERIFICANDO CONECTIVIDAD AL VPS" "TITLE"
try {
    $ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet -ErrorAction Stop
    if ($ping) {
        Write-Status "VPS $VPS_IP es accesible" "SUCCESS"
    } else {
        Write-Status "VPS $VPS_IP no responde al ping" "ERROR"
    }
} catch {
    Write-Status "Error verificando conectividad: $($_.Exception.Message)" "ERROR"
}

# 2. VERIFICAR FRONTEND
Write-Status "VERIFICANDO FRONTEND (Puerto $FRONTEND_PORT)" "TITLE"

# Página principal
try {
    $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$FRONTEND_PORT" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Status "Página principal responde - HTTP $($response.StatusCode)" "SUCCESS"
    if ($Detallado) {
        Write-Host "   Content-Length: $($response.Headers.'Content-Length')" -ForegroundColor Gray
    }
} catch {
    Write-Status "Página principal ERROR: $($_.Exception.Message)" "ERROR"
}

# Página de login
try {
    $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$FRONTEND_PORT/login" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Status "Página de login responde - HTTP $($response.StatusCode)" "SUCCESS"
} catch {
    Write-Status "Página de login ERROR: $($_.Exception.Message)" "ERROR"
    Write-Status "PROBLEMA DETECTADO: Routing SPA no configurado en Nginx" "WARNING"
}

# Otras rutas importantes
$frontendRoutes = @("/register", "/personal", "/departamentos")
foreach ($route in $frontendRoutes) {
    try {
        $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$FRONTEND_PORT$route" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Status "Ruta $route - HTTP $($response.StatusCode)" "SUCCESS"
    } catch {
        Write-Status "Ruta $route - ERROR" "ERROR"
    }
}

# 3. VERIFICAR BACKEND
Write-Status "VERIFICANDO BACKEND (Puerto $BACKEND_PORT)" "TITLE"

# Health check
try {
    $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$BACKEND_PORT/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Status "Backend Health Check - HTTP $($response.StatusCode)" "SUCCESS"
    Write-Host "   Respuesta: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Status "Backend Health Check ERROR: $($_.Exception.Message)" "ERROR"
}

# Auth verify (requiere token, esperamos 401)
try {
    $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$BACKEND_PORT/api/auth/verify" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Status "Auth verify responde - HTTP $($response.StatusCode)" "SUCCESS"
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Status "Auth verify responde 401 (esperado sin token)" "SUCCESS"
    } else {
        Write-Status "Auth verify ERROR: $($_.Exception.Message)" "ERROR"
    }
}

# 4. VERIFICAR ARCHIVOS LOCALES
Write-Status "VERIFICANDO ARCHIVOS LOCALES" "TITLE"

$archivos = @{
    "frontend/package.json" = "Configuración del frontend"
    "backend/package.json" = "Configuración del backend"
    "frontend/dist/index.html" = "Build del frontend"
    "frontend/src/routes/AppRoutes.jsx" = "Rutas de la aplicación"
    "frontend/src/store/authStore.js" = "Store de autenticación"
    "frontend/src/pages/Registroylogeo/LoginPage.jsx" = "Página de login"
}

foreach ($archivo in $archivos.GetEnumerator()) {
    if (Test-Path $archivo.Key) {
        Write-Status "$($archivo.Value) existe" "SUCCESS"
    } else {
        Write-Status "$($archivo.Value) NO EXISTE" "ERROR"
    }
}

# 5. VERIFICAR ESTADO DEL GIT
Write-Status "VERIFICANDO ESTADO DEL REPOSITORIO" "TITLE"

try {
    $gitBranch = git branch --show-current 2>$null
    $gitCommit = git log -1 --oneline 2>$null
    $gitStatus = git status --porcelain 2>$null
    
    Write-Status "Rama actual: $gitBranch" "INFO"
    Write-Status "Último commit: $gitCommit" "INFO"
    
    if ($gitStatus) {
        Write-Status "Hay cambios sin commitear" "WARNING"
        if ($Detallado) {
            Write-Host $gitStatus -ForegroundColor Yellow
        }
    } else {
        Write-Status "Repositorio limpio (sin cambios pendientes)" "SUCCESS"
    }
} catch {
    Write-Status "Error verificando Git: $($_.Exception.Message)" "ERROR"
}

# 6. VERIFICAR PROCESOS LOCALES
Write-Status "VERIFICANDO PROCESOS LOCALES" "TITLE"

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version 2>$null
    Write-Status "Node.js instalado: $nodeVersion" "SUCCESS"
} catch {
    Write-Status "Node.js NO instalado" "ERROR"
}

# Verificar si NPM está instalado
try {
    $npmVersion = npm --version 2>$null
    Write-Status "NPM instalado: $npmVersion" "SUCCESS"
} catch {
    Write-Status "NPM NO instalado" "ERROR"
}

# 7. RESUMEN Y RECOMENDACIONES
Write-Status "RESUMEN Y RECOMENDACIONES" "TITLE"

Write-Host "`n📋 DIAGNÓSTICO COMPLETADO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n🎯 PROBLEMAS COMUNES DETECTADOS:" -ForegroundColor Yellow
Write-Host "• Si hay ERROR 404 en /login: Problema de routing SPA en Nginx" -ForegroundColor White
Write-Host "• Si Backend Health falla: Problema en el servidor Node.js" -ForegroundColor White
Write-Host "• Si Frontend principal falla: Problema en build o PM2" -ForegroundColor White

Write-Host "`n🔧 COMANDOS PARA EL SERVIDOR (SSH):" -ForegroundColor Yellow
Write-Host "pm2 status" -ForegroundColor Gray
Write-Host "pm2 logs 9001app2-frontend --lines 20" -ForegroundColor Gray
Write-Host "pm2 logs 9001app2-backend --lines 20" -ForegroundColor Gray
Write-Host "nginx -t && nginx -s reload" -ForegroundColor Gray
Write-Host "/root/deploy-9001app2.sh" -ForegroundColor Gray

Write-Host "`n🌐 URLs DEL SISTEMA:" -ForegroundColor Yellow
Write-Host "Frontend: http://$VPS_IP`:$FRONTEND_PORT" -ForegroundColor Gray
Write-Host "Backend:  http://$VPS_IP`:$BACKEND_PORT" -ForegroundColor Gray
Write-Host "Health:   http://$VPS_IP`:$BACKEND_PORT/api/health" -ForegroundColor Gray

Write-Host "`n✅ DIAGNÓSTICO FINALIZADO - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green

# Opción para mostrar ayuda detallada
Write-Host "`nPara diagnostico detallado: .\diagnostico-9001app2.ps1 -Detallado" -ForegroundColor Cyan
