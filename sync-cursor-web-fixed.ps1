# Script para sincronizar repositorio y hacer funcionar "Apply changes locally"
# Version sin emojis para compatibilidad total
# Ejecutar: .\sync-cursor-web-fixed.ps1

Write-Host "Sincronizando repositorio para Cursor Web..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Funcion para verificar si hay cambios locales
function Test-LocalChanges {
    $status = git status --porcelain
    return $status -ne ""
}

# Funcion para verificar si estamos adelante del remoto
function Test-AheadOfRemote {
    try {
        $local = git rev-list --count HEAD
        $remote = git rev-list --count origin/main 2>$null
        return [int]$local -gt [int]$remote
    } catch {
        return $false
    }
}

# Funcion para hacer backup de cambios locales
function Backup-LocalChanges {
    Write-Host "Haciendo backup de cambios locales..." -ForegroundColor Yellow
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = "backup-local-$timestamp"
    
    # Crear directorio de backup
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Copiar archivos modificados
    $modifiedFiles = git status --porcelain | Where-Object { $_ -match "^.M" } | ForEach-Object { ($_ -split "\s+")[1] }
    
    foreach ($file in $modifiedFiles) {
        if (Test-Path $file) {
            $backupPath = Join-Path $backupDir $file
            $backupDirPath = Split-Path $backupPath -Parent
            if ($backupDirPath) {
                New-Item -ItemType Directory -Path $backupDirPath -Force | Out-Null
            }
            Copy-Item $file $backupPath
            Write-Host "  Backup: $file" -ForegroundColor Gray
        }
    }
    
    Write-Host "Backup creado en: $backupDir" -ForegroundColor Green
    return $backupDir
}

# Funcion principal simplificada
function Main {
    Write-Host "Verificando estado del repositorio..." -ForegroundColor Blue
    
    # Verificar si estamos en un repositorio Git
    if (-not (Test-Path ".git")) {
        Write-Host "ERROR: No estas en un repositorio Git" -ForegroundColor Red
        return
    }
    
    # Verificar estado actual
    $hasLocalChanges = Test-LocalChanges
    $isAheadOfRemote = Test-AheadOfRemote
    
    Write-Host "`nEstado actual:" -ForegroundColor Cyan
    Write-Host "  Cambios locales: $($hasLocalChanges ? 'SI' : 'NO')" -ForegroundColor White
    Write-Host "  Adelante del remoto: $($isAheadOfRemote ? 'SI' : 'NO')" -ForegroundColor White
    
    $backupDir = $null
    
    if ($hasLocalChanges) {
        Write-Host "`nHaciendo backup de cambios locales..." -ForegroundColor Yellow
        $backupDir = Backup-LocalChanges
        
        # Stash de cambios
        Write-Host "Guardando cambios en stash..." -ForegroundColor Yellow
        git stash push -m "Backup automatico antes de sincronizar"
    }
    
    # Sincronizar con remoto
    Write-Host "`nSincronizando con repositorio remoto..." -ForegroundColor Blue
    
    try {
        # Fetch de cambios remotos
        Write-Host "  Obteniendo cambios remotos..." -ForegroundColor Yellow
        git fetch origin
        
        # Hacer merge sin conflictos
        Write-Host "  Integrando cambios remotos..." -ForegroundColor Yellow
        git pull origin main --no-edit
        
        Write-Host "Repositorio sincronizado exitosamente" -ForegroundColor Green
        
        Write-Host "`nSincronizacion completada!" -ForegroundColor Green
        Write-Host "Ahora 'Apply changes locally' deberia funcionar" -ForegroundColor Green
        
        if ($hasLocalChanges) {
            Write-Host "`nRestaurando cambios locales..." -ForegroundColor Yellow
            git stash pop
        }
        
    } catch {
        Write-Host "ERROR durante la sincronizacion: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Revisa los errores y ejecuta manualmente:" -ForegroundColor Yellow
        Write-Host "   git status" -ForegroundColor White
        Write-Host "   git pull origin main" -ForegroundColor White
    }
    
    Write-Host "`nProximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Abre Cursor Web" -ForegroundColor White
    Write-Host "2. Ve a tu repositorio" -ForegroundColor White
    Write-Host "3. Ahora 'Apply changes locally' deberia funcionar" -ForegroundColor White
    Write-Host "4. Si hay problemas, ejecuta este script nuevamente" -ForegroundColor White
    
    if ($backupDir) {
        Write-Host "`nNOTA: Tu backup esta en: $backupDir" -ForegroundColor Yellow
    }
}

# Ejecutar script
Main
