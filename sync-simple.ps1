# Script simplificado para sincronizar repositorio
# Compatible con todas las versiones de PowerShell
# Ejecutar: .\sync-simple.ps1

Write-Host "=== SINCRONIZACION DE REPOSITORIO ===" -ForegroundColor Green

# Verificar si estamos en un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: No estas en un repositorio Git" -ForegroundColor Red
    exit 1
}

Write-Host "Verificando estado del repositorio..." -ForegroundColor Blue

# Verificar cambios locales
$status = git status --porcelain
$hasChanges = $status -ne ""

if ($hasChanges) {
    Write-Host "  Cambios locales: SI" -ForegroundColor Yellow
    Write-Host "  Guardando cambios temporalmente..." -ForegroundColor Yellow
    git stash push -m "Backup automatico para sincronizacion"
} else {
    Write-Host "  Cambios locales: NO" -ForegroundColor Green
}

Write-Host "Sincronizando con repositorio remoto..." -ForegroundColor Blue

try {
    # Obtener cambios del remoto
    git fetch origin
    Write-Host "  Cambios remotos obtenidos" -ForegroundColor Green
    
    # Integrar cambios
    git pull origin main --no-edit
    Write-Host "  Cambios integrados exitosamente" -ForegroundColor Green
    
    if ($hasChanges) {
        Write-Host "Restaurando cambios locales..." -ForegroundColor Yellow
        git stash pop
        Write-Host "  Cambios locales restaurados" -ForegroundColor Green
    }
    
    Write-Host "`n=== SINCRONIZACION COMPLETADA ===" -ForegroundColor Green
    Write-Host "SOLUCION APLICADA:" -ForegroundColor Cyan
    Write-Host "1. Repositorio sincronizado correctamente" -ForegroundColor White
    Write-Host "2. 'Apply changes locally' deberia funcionar ahora" -ForegroundColor White
    Write-Host "3. Vuelve a Cursor Web y prueba nuevamente" -ForegroundColor White
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Solucion manual:" -ForegroundColor Yellow
    Write-Host "  git status" -ForegroundColor White
    Write-Host "  git fetch origin" -ForegroundColor White
    Write-Host "  git pull origin main" -ForegroundColor White
    
    if ($hasChanges) {
        Write-Host "  git stash pop" -ForegroundColor White
    }
}

Write-Host "`nOTRAS ALTERNATIVAS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "A. Descargar Cursor Desktop (RECOMENDADO)" -ForegroundColor White
Write-Host "B. Usar Visual Studio Code con extension" -ForegroundColor White
Write-Host "C. Usar GitHub Codespaces" -ForegroundColor White
