# Script de Diagnostico para Cursor Web - VERSION CORREGIDA
# Ejecutar: .\diagnostico-cursor-web-fixed.ps1

Write-Host "Diagnostico de Cursor Web - 9001app-v2" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

# Funcion para verificar configuracion de Git
function Test-GitConfig {
    Write-Host "`nVerificando configuracion de Git..." -ForegroundColor Blue
    
    $userName = git config --global user.name
    $userEmail = git config --global user.email
    
    if (-not $userName -or -not $userEmail) {
        Write-Host "Configuracion de Git incompleta" -ForegroundColor Red
        Write-Host "Configurando Git..." -ForegroundColor Yellow
        
        $newName = Read-Host "Ingresa tu nombre de usuario para Git"
        $newEmail = Read-Host "Ingresa tu email para Git"
        
        git config --global user.name $newName
        git config --global user.email $newEmail
        
        Write-Host "Git configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "Git configurado: $userName <$userEmail>" -ForegroundColor Green
    }
}

# Funcion para verificar autenticacion de GitHub
function Test-GitHubAuth {
    Write-Host "`nVerificando autenticacion de GitHub..." -ForegroundColor Blue
    
    try {
        $authStatus = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Autenticado en GitHub" -ForegroundColor Green
            return $true
        } else {
            Write-Host "No autenticado en GitHub" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "GitHub CLI no instalado" -ForegroundColor Red
        return $false
    }
}

# Funcion para verificar estado del repositorio
function Test-RepositoryStatus {
    Write-Host "`nVerificando estado del repositorio..." -ForegroundColor Blue
    
    # Verificar si estamos en un repositorio Git
    if (-not (Test-Path ".git")) {
        Write-Host "No estas en un repositorio Git" -ForegroundColor Red
        return $false
    }
    
    # Verificar estado
    $status = git status --porcelain
    $hasChanges = $status -ne ""
    
    # Verificar commits adelante del remoto
    $localCommits = git rev-list --count HEAD
    $remoteCommits = git rev-list --count origin/main 2>$null
    $isAhead = [int]$localCommits -gt [int]$remoteCommits
    
    Write-Host "  Cambios sin commit: $($hasChanges ? 'SI' : 'NO')" -ForegroundColor White
    Write-Host "  Commits adelante del remoto: $($isAhead ? 'SI' : 'NO')" -ForegroundColor White
    
    if ($hasChanges) {
        Write-Host "  Archivos modificados:" -ForegroundColor Yellow
        $status | ForEach-Object {
            $file = ($_ -split "\s+")[1]
            Write-Host "    $file" -ForegroundColor Gray
        }
    }
    
    return $true
}

# Funcion para solucionar problemas comunes
function Fix-CommonIssues {
    Write-Host "`nSolucionando problemas comunes..." -ForegroundColor Blue
    
    # Problema 1: Repositorio desincronizado
    Write-Host "  Sincronizando repositorio..." -ForegroundColor Yellow
    git fetch origin
    
    # Problema 2: Cambios locales conflictivos
    $hasChanges = git status --porcelain -ne ""
    if ($hasChanges) {
        Write-Host "  Guardando cambios locales..." -ForegroundColor Yellow
        git stash push -m "Backup automatico antes de sincronizar"
    }
    
    # Problema 3: Pull del remoto
    Write-Host "  Integrando cambios remotos..." -ForegroundColor Yellow
    try {
        git pull origin main --no-edit
        Write-Host "  Sincronizacion exitosa" -ForegroundColor Green
    } catch {
        Write-Host "  Error en sincronizacion" -ForegroundColor Red
    }
    
    # Problema 4: Restaurar cambios locales
    if ($hasChanges) {
        Write-Host "  Restaurando cambios locales..." -ForegroundColor Yellow
        git stash pop
    }
}

# Funcion para verificar permisos de archivos
function Test-FilePermissions {
    Write-Host "`nVerificando permisos de archivos..." -ForegroundColor Blue
    
    $criticalFiles = @(
        ".git",
        "backend",
        "frontend",
        "package.json"
    )
    
    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            try {
                $permissions = Get-Acl $file | Select-Object -ExpandProperty Access
                $hasWriteAccess = $permissions | Where-Object { $_.FileSystemRights -match "Write" }
                
                if ($hasWriteAccess) {
                    Write-Host "  $file - Permisos correctos" -ForegroundColor Green
                } else {
                    Write-Host "  $file - Sin permisos de escritura" -ForegroundColor Red
                }
            } catch {
                Write-Host "  $file - Error verificando permisos" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  $file - No encontrado" -ForegroundColor Yellow
        }
    }
}

# Funcion para generar reporte de diagnostico
function Generate-DiagnosticReport {
    Write-Host "`nGenerando reporte de diagnostico..." -ForegroundColor Blue
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $reportFile = "diagnostico-cursor-web-$timestamp.txt"
    
    $report = @"
=== DIAGNOSTICO CURSOR WEB - $timestamp ===

ESTADO DEL REPOSITORIO:
$(git status)

CONFIGURACION GIT:
Usuario: $(git config --global user.name)
Email: $(git config --global user.email)
Rama actual: $(git branch --show-current)
Ultimo commit: $(git log -1 --oneline)

CONEXION REMOTA:
Origin: $(git remote get-url origin)
Ultimo fetch: $(git log -1 --format="%cd" --date=iso origin/main)

ARCHIVOS MODIFICADOS:
$(git status --porcelain)

RECOMENDACIONES:
1. Ejecutar: .\sync-cursor-web.ps1
2. Verificar autenticacion GitHub
3. Sincronizar repositorio
4. Probar "Apply changes locally"
"@
    
    $report | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Host "Reporte guardado en: $reportFile" -ForegroundColor Green
    
    return $reportFile
}

# Funcion principal
function Main {
    Write-Host "Iniciando diagnostico completo..." -ForegroundColor Green
    
    # 1. Verificar Git
    Test-GitConfig
    
    # 2. Verificar GitHub
    $githubAuth = Test-GitHubAuth
    
    # 3. Verificar repositorio
    $repoOk = Test-RepositoryStatus
    
    # 4. Verificar permisos
    Test-FilePermissions
    
    # 5. Solucionar problemas si es necesario
    if (-not $repoOk) {
        Write-Host "`nProblemas detectados en el repositorio" -ForegroundColor Yellow
        $fixChoice = Read-Host "Quieres que intente solucionarlos automaticamente? (s/n)"
        
        if ($fixChoice -eq "s" -or $fixChoice -eq "S") {
            Fix-CommonIssues
        }
    }
    
    # 6. Generar reporte
    $reportFile = Generate-DiagnosticReport
    
    # 7. Resumen final
    Write-Host "`nRESUMEN DEL DIAGNOSTICO:" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    
    if ($repoOk -and $githubAuth) {
        Write-Host "Estado: BUENO - Cursor Web deberia funcionar" -ForegroundColor Green
        Write-Host "Proximo paso: Probar 'Apply changes locally'" -ForegroundColor Blue
    } elseif ($repoOk) {
        Write-Host "Estado: REGULAR - Problemas de autenticacion GitHub" -ForegroundColor Yellow
        Write-Host "Solucion: Ejecutar 'gh auth login'" -ForegroundColor Blue
    } else {
        Write-Host "Estado: CRITICO - Problemas en el repositorio" -ForegroundColor Red
        Write-Host "Solucion: Ejecutar '.\sync-cursor-web.ps1'" -ForegroundColor Blue
    }
    
    Write-Host "`nArchivos creados:" -ForegroundColor Cyan
    Write-Host "  $reportFile - Reporte completo" -ForegroundColor White
    Write-Host "  sync-cursor-web.ps1 - Script de sincronizacion" -ForegroundColor White
    Write-Host "  comandos-rapidos.ps1 - Comandos rapidos" -ForegroundColor White
    
    Write-Host "`nPara solucionar 'Apply changes locally':" -ForegroundColor Cyan
    Write-Host "1. Ejecutar: .\sync-cursor-web.ps1" -ForegroundColor White
    Write-Host "2. Abrir Cursor Web" -ForegroundColor White
    Write-Host "3. Probar el boton nuevamente" -ForegroundColor White
}

# Ejecutar diagnostico
Main
