# Script para solucionar el problema de login
# Establece contraseñas para usuarios existentes y prueba el login

Write-Host "🔧 SOLUCIONANDO PROBLEMA DE LOGIN" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$API_BASE = "http://localhost:5000/api"
$EMAIL = "juan.lopez@agronorte.com"
$PASSWORD = "123456"

# Función para hacer peticiones HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $jsonBody
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        
        return @{
            Success = $true
            Data = $response
        }
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $_.Exception.Response.StatusCode.value__
        }
    }
}

Write-Host ""
Write-Host "📋 DIAGNÓSTICO DEL PROBLEMA:" -ForegroundColor Yellow
Write-Host "- Los usuarios existen en MongoDB Atlas" -ForegroundColor White
Write-Host "- Los usuarios NO tienen contraseñas configuradas" -ForegroundColor White
Write-Host "- El backend está corriendo en puerto 5000" -ForegroundColor White
Write-Host "- El frontend está en puerto 3000" -ForegroundColor White

Write-Host ""
Write-Host "🔑 PASO 1: Estableciendo contraseña..." -ForegroundColor Green

$setPasswordBody = @{
    email = $EMAIL
    password = $PASSWORD
}

$setPasswordResult = Invoke-ApiRequest -Url "$API_BASE/auth/set-password" -Method "POST" -Body $setPasswordBody

if ($setPasswordResult.Success) {
    Write-Host "✅ Contraseña establecida exitosamente" -ForegroundColor Green
    Write-Host "   Email: $($setPasswordResult.Data.data.email)" -ForegroundColor White
    Write-Host "   Contraseña configurada: $($setPasswordResult.Data.data.passwordSet)" -ForegroundColor White
} else {
    Write-Host "❌ Error estableciendo contraseña: $($setPasswordResult.Error)" -ForegroundColor Red
    if ($setPasswordResult.StatusCode) {
        Write-Host "   Código de estado: $($setPasswordResult.StatusCode)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "🚀 PASO 2: Probando login..." -ForegroundColor Green

$loginBody = @{
    email = $EMAIL
    password = $PASSWORD
}

$loginResult = Invoke-ApiRequest -Url "$API_BASE/auth/login" -Method "POST" -Body $loginBody

if ($loginResult.Success) {
    Write-Host "✅ Login exitoso!" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResult.Data.data.user.nombre) $($loginResult.Data.data.user.apellido)" -ForegroundColor White
    Write-Host "   Email: $($loginResult.Data.data.user.email)" -ForegroundColor White
    Write-Host "   Organización: $($loginResult.Data.data.user.organization.nombre)" -ForegroundColor White
    Write-Host "   Token generado: $($loginResult.Data.data.tokens.accessToken -ne $null)" -ForegroundColor White
} else {
    Write-Host "❌ Error en login: $($loginResult.Error)" -ForegroundColor Red
    if ($loginResult.StatusCode) {
        Write-Host "   Código de estado: $($loginResult.StatusCode)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "🎉 PROBLEMA SOLUCIONADO!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "Credenciales de prueba:" -ForegroundColor Yellow
Write-Host "  Email: $EMAIL" -ForegroundColor White
Write-Host "  Contraseña: $PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Ahora puedes hacer login en: http://localhost:3000" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Ir a http://localhost:3000" -ForegroundColor White
Write-Host "2. Usar las credenciales de arriba para hacer login" -ForegroundColor White
Write-Host "3. Si hay otros usuarios, repetir el proceso con sus emails" -ForegroundColor White

# Preguntar si quiere abrir la aplicación
Write-Host ""
$openApp = Read-Host "¿Quieres abrir la aplicación ahora? (s/n)"
if ($openApp -eq "s" -or $openApp -eq "S" -or $openApp -eq "y" -or $openApp -eq "Y") {
    Start-Process "http://localhost:3000"
}