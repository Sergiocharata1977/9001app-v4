# Script Simple para Solucionar Cursor Web
# Ejecutar: .\solucionar-cursor-web.ps1

Write-Host "Solucionando Cursor Web - 9001app-v2" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# 1. Verificar estado actual
Write-Host "`n1. Verificando estado del repositorio..." -ForegroundColor Blue
git status

# 2. Obtener cambios del remoto
Write-Host "`n2. Obteniendo cambios del repositorio remoto..." -ForegroundColor Blue
git fetch origin

# 3. Ver diferencias
Write-Host "`n3. Verificando diferencias con remoto..." -ForegroundColor Blue
$localCommits = git rev-list --count HEAD
$remoteCommits = git rev-list --count origin/main
Write-Host "Commits locales: $localCommits" -ForegroundColor White
Write-Host "Commits remotos: $remoteCommits" -ForegroundColor White

# 4. Sincronizar si es necesario
if ([int]$localCommits -gt [int]$remoteCommits) {
    Write-Host "`n4. Sincronizando repositorio..." -ForegroundColor Yellow
    
    # Guardar cambios locales
    $hasChanges = git status --porcelain -ne ""
    if ($hasChanges) {
        Write-Host "Guardando cambios locales..." -ForegroundColor Yellow
        git stash push -m "Backup antes de sincronizar"
    }
    
    # Pull del remoto
    Write-Host "Integrando cambios remotos..." -ForegroundColor Yellow
    git pull origin main
    
    # Restaurar cambios locales
    if ($hasChanges) {
        Write-Host "Restaurando cambios locales..." -ForegroundColor Yellow
        git stash pop
    }
    
    Write-Host "Sincronizacion completada!" -ForegroundColor Green
} else {
    Write-Host "`n4. Repositorio ya esta sincronizado" -ForegroundColor Green
}

# 5. Estado final
Write-Host "`n5. Estado final del repositorio:" -ForegroundColor Blue
git status

# 6. Instrucciones para Cursor Web
Write-Host "`n🎯 INSTRUCCIONES PARA CURSOR WEB:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "1. Abre Cursor Web" -ForegroundColor White
Write-Host "2. Ve a tu repositorio: https://github.com/Sergiocharata1977/9001app-v2" -ForegroundColor White
Write-Host "3. Ahora 'Apply changes locally' deberia funcionar" -ForegroundColor White
Write-Host "4. Si no funciona, ejecuta este script nuevamente" -ForegroundColor White

Write-Host "`n✅ Script completado!" -ForegroundColor Green
Write-Host "Ahora prueba Cursor Web" -ForegroundColor Blue
