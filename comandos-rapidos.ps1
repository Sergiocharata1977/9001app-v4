# Script de Comandos Rápidos para 9001app-v2
# Ejecutar: .\comandos-rapidos.ps1

Write-Host "🚀 Comandos Rápidos para 9001app-v2" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

function Show-Menu {
    Write-Host "`n📋 Selecciona una opción:" -ForegroundColor Yellow
    Write-Host "1. 🔄 Estado del repositorio" -ForegroundColor White
    Write-Host "2. 📥 Pull del repositorio remoto" -ForegroundColor White
    Write-Host "3. 📤 Push de cambios locales" -ForegroundColor White
    Write-Host "4. 🚀 Iniciar backend" -ForegroundColor White
    Write-Host "5. 🌐 Iniciar frontend" -ForegroundColor White
    Write-Host "6. 🔧 Instalar dependencias" -ForegroundColor White
    Write-Host "7. 🧹 Limpiar y reinstalar" -ForegroundColor White
    Write-Host "8. 📊 Ver logs del sistema" -ForegroundColor White
    Write-Host "9. 🔍 Buscar archivos" -ForegroundColor White
    Write-Host "0. ❌ Salir" -ForegroundColor Red
}

function Get-GitStatus {
    Write-Host "`n🔍 Verificando estado del repositorio..." -ForegroundColor Blue
    git status
}

function Sync-Repository {
    Write-Host "`n📥 Sincronizando con repositorio remoto..." -ForegroundColor Blue
    git fetch origin
    git pull origin main
}

function Push-Changes {
    Write-Host "`n📤 Enviando cambios al repositorio..." -ForegroundColor Blue
    git add .
    git commit -m "Actualización automática $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin main
}

function Start-Backend {
    Write-Host "`n🚀 Iniciando backend..." -ForegroundColor Blue
    Set-Location backend
    npm start
}

function Start-Frontend {
    Write-Host "`n🌐 Iniciando frontend..." -ForegroundColor Blue
    Set-Location frontend
    npm run dev
}

function Install-Dependencies {
    Write-Host "`n🔧 Instalando dependencias..." -ForegroundColor Blue
    Write-Host "Backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Write-Host "Frontend..." -ForegroundColor Yellow
    Set-Location ../frontend
    npm install
    Set-Location ..
}

function Clean-Reinstall {
    Write-Host "`n🧹 Limpiando e instalando..." -ForegroundColor Blue
    Write-Host "Limpiando node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force backend/node_modules -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force frontend/node_modules -ErrorAction SilentlyContinue
    Write-Host "Reinstalando..." -ForegroundColor Yellow
    Install-Dependencies
}

function Show-Logs {
    Write-Host "`n📊 Mostrando logs del sistema..." -ForegroundColor Blue
    Get-ChildItem -Path logs -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | ForEach-Object {
        Write-Host "📄 $($_.Name) - $($_.LastWriteTime)" -ForegroundColor Cyan
    }
}

function Search-Files {
    Write-Host "`n🔍 Buscando archivos..." -ForegroundColor Blue
    $searchTerm = Read-Host "Ingresa el término de búsqueda"
    Get-ChildItem -Recurse -File | Where-Object { $_.Name -like "*$searchTerm*" } | Select-Object -First 10 | ForEach-Object {
        Write-Host "📁 $($_.FullName)" -ForegroundColor White
    }
}

# Menú principal
do {
    Show-Menu
    $choice = Read-Host "`nSelecciona una opción (0-9)"
    
    switch ($choice) {
        "1" { Get-GitStatus }
        "2" { Sync-Repository }
        "3" { Push-Changes }
        "4" { Start-Backend }
        "5" { Start-Frontend }
        "6" { Install-Dependencies }
        "7" { Clean-Reinstall }
        "8" { Show-Logs }
        "9" { Search-Files }
        "0" { 
            Write-Host "`n👋 ¡Hasta luego!" -ForegroundColor Green
            break 
        }
        default { 
            Write-Host "`n❌ Opción inválida. Intenta de nuevo." -ForegroundColor Red 
        }
    }
    
    if ($choice -ne "0") {
        Write-Host "`n⏸️ Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} while ($choice -ne "0")
