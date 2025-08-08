Write-Host "=== DIAGNÓSTICO 9001APP2 ===" -ForegroundColor Cyan

$VPS_IP = "31.97.162.229"

Write-Host "`n1. VERIFICANDO VPS CONECTIVIDAD..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet -ErrorAction SilentlyContinue
if ($ping) {
    Write-Host "✅ VPS accesible" -ForegroundColor Green
} else {
    Write-Host "❌ VPS no accesible" -ForegroundColor Red
}

Write-Host "`n2. VERIFICANDO FRONTEND (Puerto 3000)..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://$VPS_IP`:3000" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend Principal - Status: $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend Principal ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $login = Invoke-WebRequest -Uri "http://$VPS_IP`:3000/login" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Login Page - Status: $($login.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Login Page ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   PROBLEMA: Routing SPA no configurado correctamente" -ForegroundColor Yellow
}

Write-Host "`n3. VERIFICANDO BACKEND (Puerto 5000)..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://$VPS_IP`:5000/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend Health - Response: $($backend.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Health ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. VERIFICANDO ARCHIVOS LOCALES..." -ForegroundColor Yellow
if (Test-Path "frontend/dist/index.html") {
    Write-Host "✅ Build del frontend existe" -ForegroundColor Green
} else {
    Write-Host "❌ Build del frontend NO existe" -ForegroundColor Red
}

if (Test-Path "frontend/src/routes/AppRoutes.jsx") {
    Write-Host "✅ AppRoutes.jsx existe" -ForegroundColor Green
} else {
    Write-Host "❌ AppRoutes.jsx NO existe" -ForegroundColor Red
}

Write-Host "`n5. ESTADO DEL GIT..." -ForegroundColor Yellow
try {
    $gitBranch = git branch --show-current 2>$null
    $gitCommit = git log -1 --oneline 2>$null
    Write-Host "Rama: $gitBranch" -ForegroundColor Cyan
    Write-Host "Commit: $gitCommit" -ForegroundColor Cyan
} catch {
    Write-Host "Error verificando Git" -ForegroundColor Red
}

Write-Host "`n=== DIAGNÓSTICO COMPLETADO ===" -ForegroundColor Cyan
Write-Host "`nProblema detectado: ERROR 404 en /login indica que:" -ForegroundColor Yellow
Write-Host "1. El servidor nginx no está configurado para SPA routing" -ForegroundColor White
Write-Host "2. Falta configuración 'try_files' en nginx" -ForegroundColor White
Write-Host "3. O el frontend no se construyó correctamente" -ForegroundColor White

Read-Host "`nPresiona Enter para continuar"
