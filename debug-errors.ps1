# ========================================
# SCRIPT DE DIAGNÓSTICO AUTOMÁTICO 9001APP2
# ========================================

Write-Host "🔍 INICIANDO DIAGNÓSTICO AUTOMÁTICO - $(Get-Date)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Yellow

# Variables
$VPS_IP = "31.97.162.229"
$FRONTEND_PORT = "3000"
$BACKEND_PORT = "5000"

Write-Host "📋 INFORMACIÓN DEL SISTEMA LOCAL" -ForegroundColor Green
Write-Host "Directorio actual: $(Get-Location)"

# Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js version: NO INSTALADO" -ForegroundColor Red
}

# Verificar NPM
try {
    $npmVersion = npm --version 2>$null
    Write-Host "NPM version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "NPM version: NO INSTALADO" -ForegroundColor Red
}

Write-Host "`n🌐 VERIFICANDO CONECTIVIDAD AL VPS" -ForegroundColor Green
Write-Host "Testing conexión a $VPS_IP..."
$ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet
if ($ping) {
    Write-Host "✅ VPS accesible" -ForegroundColor Green
} else {
    Write-Host "❌ VPS no accesible" -ForegroundColor Red
}

Write-Host "`n🚀 VERIFICANDO SERVICIOS EN VPS" -ForegroundColor Green

# Verificar Frontend
Write-Host "Verificando Frontend ($VPS_IP`:$FRONTEND_PORT)..."
try {
    $frontend = Invoke-WebRequest -Uri "http://$VPS_IP`:$FRONTEND_PORT" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Frontend respondiendo - Status: $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar Backend Health
Write-Host "Verificando Backend Health ($VPS_IP`:$BACKEND_PORT/api/health)..."
try {
    $backend = Invoke-WebRequest -Uri "http://$VPS_IP`:$BACKEND_PORT/api/health" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Backend Health OK - Response: $($backend.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Health ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar ruta de login específicamente
Write-Host "Verificando ruta de login ($VPS_IP`:$FRONTEND_PORT/login)..."
try {
    $login = Invoke-WebRequest -Uri "http://$VPS_IP`:$FRONTEND_PORT/login" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Login accesible - Status: $($login.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Login ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Esto indica un problema de routing en el frontend" -ForegroundColor Yellow
}

Write-Host "`n📁 VERIFICANDO ARCHIVOS LOCALES" -ForegroundColor Green

# Verificar si existe package.json en frontend
if (Test-Path "frontend/package.json") {
    Write-Host "✅ frontend/package.json existe" -ForegroundColor Green
} else {
    Write-Host "❌ frontend/package.json NO EXISTE" -ForegroundColor Red
}

# Verificar si existe el archivo de rutas
if (Test-Path "frontend/src/routes/AppRoutes.jsx") {
    Write-Host "✅ AppRoutes.jsx existe" -ForegroundColor Green
} else {
    Write-Host "❌ AppRoutes.jsx NO EXISTE" -ForegroundColor Red
}

# Verificar si existe LoginPage
if (Test-Path "frontend/src/pages/Registroylogeo/LoginPage.jsx") {
    Write-Host "✅ LoginPage.jsx existe" -ForegroundColor Green
} else {
    Write-Host "❌ LoginPage.jsx NO EXISTE" -ForegroundColor Red
}

Write-Host "`n🔍 VERIFICANDO ESTADO DEL REPOSITORIO GIT" -ForegroundColor Green
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "⚠️ Hay cambios sin commitear:" -ForegroundColor Yellow
        Write-Host $gitStatus
    } else {
        Write-Host "✅ Repositorio limpio" -ForegroundColor Green
    }
    
    $gitBranch = git branch --show-current 2>$null
    Write-Host "📍 Rama actual: $gitBranch" -ForegroundColor Cyan
    
    $gitCommit = git log -1 --oneline 2>$null
    Write-Host "📝 Último commit: $gitCommit" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error verificando Git: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🧪 PROBANDO ENDPOINTS ESPECÍFICOS" -ForegroundColor Green

# Test de diferentes rutas
$routes = @(
    "/",
    "/login", 
    "/register",
    "/personal",
    "/departamentos"
)

foreach ($route in $routes) {
    Write-Host "Testing: http://$VPS_IP`:$FRONTEND_PORT$route"
    try {
        $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$FRONTEND_PORT$route" -TimeoutSec 5 -UseBasicParsing
        Write-Host "  ✅ $route - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ $route - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🔧 VERIFICANDO ENDPOINTS DEL BACKEND" -ForegroundColor Green
# Test de endpoints del backend
$backendRoutes = @(
    "/api/health",
    "/api/auth/verify"
)

foreach ($route in $backendRoutes) {
    Write-Host "Testing Backend: http://$VPS_IP`:$BACKEND_PORT$route"
    try {
        $response = Invoke-WebRequest -Uri "http://$VPS_IP`:$BACKEND_PORT$route" -TimeoutSec 5 -UseBasicParsing
        Write-Host "  ✅ $route - Status: $($response.StatusCode)" -ForegroundColor Green
        if ($route -eq "/api/health") {
            Write-Host "  📊 Response: $($response.Content)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "  ❌ $route - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n📋 RESUMEN DE DIAGNÓSTICO" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow
Write-Host "1. Si Frontend responde en / pero no en /login: PROBLEMA DE ROUTING SPA" -ForegroundColor Yellow
Write-Host "2. Si Backend Health falla: PROBLEMA DE BACKEND" -ForegroundColor Yellow  
Write-Host "3. Si hay errores 404 en rutas: NGINX/HISTORYAPI FALLBACK NO CONFIGURADO" -ForegroundColor Yellow
Write-Host "4. Verificar logs con: pm2 logs en el servidor" -ForegroundColor Yellow

Write-Host "`n🚀 COMANDOS RECOMENDADOS PARA EL SERVIDOR:" -ForegroundColor Cyan
Write-Host "SSH al servidor y ejecutar:" -ForegroundColor White
Write-Host "1. pm2 status" -ForegroundColor Gray
Write-Host "2. pm2 logs 9001app2-frontend --lines 20" -ForegroundColor Gray
Write-Host "3. pm2 logs 9001app2-backend --lines 20" -ForegroundColor Gray
Write-Host "4. nginx -t && nginx -s reload" -ForegroundColor Gray

Write-Host "`n✨ DIAGNÓSTICO COMPLETADO - $(Get-Date)" -ForegroundColor Cyan

# Pausa para revisar resultados
Read-Host "`nPresiona Enter para continuar"
