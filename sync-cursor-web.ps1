# Script para sincronizar repositorio y hacer funcionar "Apply changes locally"
# Ejecutar: .\sync-cursor-web.ps1

Write-Host "🔄 Sincronizando repositorio para Cursor Web..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Función para verificar si hay cambios locales
function Test-LocalChanges {
    $status = git status --porcelain
    return $status -ne ""
}

# Función para verificar si estamos adelante del remoto
function Test-AheadOfRemote {
    $local = git rev-list --count HEAD
    $remote = git rev-list --count origin/main
    return [int]$local -gt [int]$remote
}

# Función para hacer backup de cambios locales
function Backup-LocalChanges {
    Write-Host "💾 Haciendo backup de cambios locales..." -ForegroundColor Yellow
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = "backup-local-$timestamp"
    
    # Crear directorio de backup
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Copiar archivos modificados
    $modifiedFiles = git status --porcelain | Where-Object { $_ -match "^M" } | ForEach-Object { ($_ -split "\s+")[1] }
    
    foreach ($file in $modifiedFiles) {
        if (Test-Path $file) {
            $backupPath = Join-Path $backupDir $file
            $backupDirPath = Split-Path $backupPath -Parent
            New-Item -ItemType Directory -Path $backupDirPath -Force | Out-Null
            Copy-Item $file $backupPath
            Write-Host "  📄 Backup: $file" -ForegroundColor Gray
        }
    }
    
    Write-Host "✅ Backup creado en: $backupDir" -ForegroundColor Green
    return $backupDir
}

# Función para sincronizar con remoto
function Sync-WithRemote {
    Write-Host "📥 Sincronizando con repositorio remoto..." -ForegroundColor Blue
    
    try {
        # Fetch de cambios remotos
        Write-Host "  🔍 Obteniendo cambios remotos..." -ForegroundColor Yellow
        git fetch origin
        
        # Verificar si hay conflictos
        $localBranch = git rev-parse --abbrev-ref HEAD
        $remoteBranch = "origin/main"
        
        # Hacer merge sin conflictos
        Write-Host "  🔄 Integrando cambios remotos..." -ForegroundColor Yellow
        git pull origin main --no-edit
        
        Write-Host "✅ Repositorio sincronizado exitosamente" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error durante la sincronización: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Función para restaurar cambios locales
function Restore-LocalChanges {
    param($backupDir)
    
    if (-not $backupDir -or -not (Test-Path $backupDir)) {
        Write-Host "⚠️ No hay backup para restaurar" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🔄 Restaurando cambios locales..." -ForegroundColor Yellow
    
    try {
        # Restaurar archivos del backup
        Get-ChildItem -Path $backupDir -Recurse -File | ForEach-Object {
            $relativePath = $_.FullName.Substring($backupDir.Length + 1)
            $targetPath = $relativePath
            
            $targetDir = Split-Path $targetPath -Parent
            if ($targetDir -and $targetDir -ne ".") {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            Copy-Item $_.FullName $targetPath -Force
            Write-Host "  📄 Restaurado: $relativePath" -ForegroundColor Gray
        }
        
        Write-Host "✅ Cambios locales restaurados" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error restaurando cambios: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Función principal
function Main {
    Write-Host "🔍 Verificando estado del repositorio..." -ForegroundColor Blue
    
    # Verificar si estamos en un repositorio Git
    if (-not (Test-Path ".git")) {
        Write-Host "❌ No estás en un repositorio Git" -ForegroundColor Red
        return
    }
    
    # Verificar estado actual
    $hasLocalChanges = Test-LocalChanges
    $isAheadOfRemote = Test-AheadOfRemote
    
    Write-Host "`n📊 Estado actual:" -ForegroundColor Cyan
    Write-Host "  📝 Cambios locales: $($hasLocalChanges ? 'SÍ' : 'NO')" -ForegroundColor White
    Write-Host "  🚀 Adelante del remoto: $($isAheadOfRemote ? 'SÍ' : 'NO')" -ForegroundColor White
    
    if ($hasLocalChanges) {
        Write-Host "`n💾 Haciendo backup de cambios locales..." -ForegroundColor Yellow
        $backupDir = Backup-LocalChanges
        
        # Stash de cambios
        Write-Host "📦 Guardando cambios en stash..." -ForegroundColor Yellow
        git stash push -m "Backup automático antes de sincronizar"
    }
    
    # Sincronizar con remoto
    $syncSuccess = Sync-WithRemote
    
    if ($syncSuccess) {
        Write-Host "`n🎉 ¡Sincronización completada!" -ForegroundColor Green
        Write-Host "✅ Ahora 'Apply changes locally' debería funcionar" -ForegroundColor Green
        
        if ($hasLocalChanges) {
            Write-Host "`n🔄 Restaurando cambios locales..." -ForegroundColor Yellow
            git stash pop
            Restore-LocalChanges $backupDir
        }
        
    } else {
        Write-Host "`n❌ La sincronización falló" -ForegroundColor Red
        Write-Host "💡 Revisa los errores y ejecuta manualmente:" -ForegroundColor Yellow
        Write-Host "   git status" -ForegroundColor White
        Write-Host "   git pull origin main" -ForegroundColor White
    }
    
    Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Abre Cursor Web" -ForegroundColor White
    Write-Host "2. Ve a tu repositorio" -ForegroundColor White
    Write-Host "3. Ahora 'Apply changes locally' debería funcionar" -ForegroundColor White
    Write-Host "4. Si hay problemas, ejecuta este script nuevamente" -ForegroundColor White
}

# Ejecutar script
Main
