param(
    [Parameter(Mandatory=$true)]
    [string]$BranchName
)

Write-Host "================================================" -ForegroundColor Blue
Write-Host "TRAENDO TRABAJO DE CURSOR: $BranchName" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue

# 1. Limpiar estado actual
Write-Host "PASO 1: Limpiando estado actual..." -ForegroundColor Yellow
git reset --hard HEAD
git clean -fd
Write-Host "  ESTADO LIMPIO" -ForegroundColor Green

# 2. Actualizar main
Write-Host "PASO 2: Actualizando rama main..." -ForegroundColor Yellow
git checkout main
git pull origin main
Write-Host "  MAIN ACTUALIZADO" -ForegroundColor Green

# 3. Traer trabajo de Cursor
Write-Host "PASO 3: Descargando trabajo de Cursor..." -ForegroundColor Yellow
git fetch origin
git checkout -b "temp-cursor-$BranchName" "origin/cursor/$BranchName"
Write-Host "  TRABAJO DE CURSOR DESCARGADO" -ForegroundColor Green

# 4. Integrar en main
Write-Host "PASO 4: Integrando trabajo en main..." -ForegroundColor Yellow
git checkout main
git merge "temp-cursor-$BranchName" --no-ff -m "Integrar trabajo de Cursor: $BranchName"
Write-Host "  TRABAJO INTEGRADO EN MAIN" -ForegroundColor Green

# 5. Subir a GitHub
Write-Host "PASO 5: Sincronizando con GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "  CAMBIOS SUBIDOS A GITHUB" -ForegroundColor Green

# 6. Limpiar
Write-Host "PASO 6: Limpiando rama temporal..." -ForegroundColor Yellow
git branch -d "temp-cursor-$BranchName"
Write-Host "  RAMA TEMPORAL ELIMINADA" -ForegroundColor Green

Write-Host "================================================" -ForegroundColor Green
Write-Host "TRABAJO TRAIDO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "ARCHIVOS INTEGRADOS AL REPOSITORIO LOCAL" -ForegroundColor Green
Write-Host "LISTO PARA PROBAR SU RENDERIZACION" -ForegroundColor Green
Write-Host "LOCAL Y GITHUB SINCRONIZADOS" -ForegroundColor Green
Write-Host ""
Write-Host "Para probar el trabajo:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend; npm run dev" -ForegroundColor White
Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Para ver los cambios:" -ForegroundColor Cyan
Write-Host "  git log --oneline -5" -ForegroundColor White
