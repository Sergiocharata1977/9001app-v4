# Script para instalar extensiones de VS Code para proyecto ISO 9001
# Ejecutar como: .\install-extensions-fixed.ps1

Write-Host "Instalando extensiones para proyecto ISO 9001..." -ForegroundColor Green

# Lista completa de extensiones organizadas por categoria
$extensions = @{
    # PowerShell y Terminal
    "PowerShell"    = @(
        "ms-vscode.powershell",
        "ms-vscode.powershell-preview",
        "ms-vscode.terminal"
    )
    
    # Base de Datos y Turso
    "Base de Datos" = @(
        "qwtel.sqlite-viewer",
        "mtxr.sqltools",
        "mtxr.sqltools-driver-sqlite",
        "cweijan.vscode-database-client2"
    )
    
    # TypeScript y React
    "TypeScript"    = @(
        "ms-vscode.vscode-typescript-next",
        "ms-vscode.vscode-json",
        "ms-vscode.vscode-eslint",
        "ms-vscode.vscode-prettier"
    )
    
    # React y Frontend
    "React"         = @(
        "ms-vscode.vscode-react-native",
        "dsznajder.es7-react-js-snippets",
        "burkeholland.simple-react-snippets"
    )
    
    # Git y Control de Versiones
    "Git"           = @(
        "ms-vscode.vscode-git",
        "eamodio.gitlens",
        "mhutchie.git-graph",
        "donjayamanne.githistory"
    )
    
    # Testing
    "Testing"       = @(
        "ms-vscode.vscode-jest",
        "ms-vscode.vscode-cypress",
        "orta.vscode-jest"
    )
    
    # IA y Autocompletado
    "IA"            = @(
        "GitHub.copilot",
        "GitHub.copilot-chat",
        "TabNine.tabnine-vscode",
        "VisualStudioExptTeam.vscodeintellicode"
    )
    
    # Analisis y Calidad
    "Calidad"       = @(
        "SonarSource.sonarlint-vscode",
        "kisstkondoros.vscode-codemetrics",
        "wix.vscode-import-cost",
        "ms-vscode.vscode-coverage-gutters"
    )
    
    # Productividad
    "Productividad" = @(
        "formulahendry.auto-rename-tag",
        "formulahendry.auto-close-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-file-utils"
    )
    
    # Temas e Iconos
    "Temas"         = @(
        "Equinusocio.vsc-material-theme",
        "PKief.material-icon-theme",
        "dracula-theme.theme-dracula"
    )
    
    # Documentacion y Diagramas
    "Documentacion" = @(
        "yzhang.markdown-all-in-one",
        "hediet.vscode-drawio",
        "jebbs.plantuml"
    )
    
    # CSS y Styling
    "CSS"           = @(
        "pranaygp.vscode-css-peek",
        "naumovs.color-highlight",
        "bradlc.vscode-tailwindcss"
    )
    
    # Snippets
    "Snippets"      = @(
        "xabikos.JavaScriptSnippets",
        "dsznajder.es7-react-js-snippets"
    )
    
    # Debugging
    "Debugging"     = @(
        "ms-vscode.vscode-js-debug",
        "ms-vscode.vscode-js-debug-companion"
    )
}

# Funcion para instalar extensiones con progreso
function Install-Extensions {
    param(
        [hashtable]$ExtensionsList
    )
    
    $totalExtensions = 0
    $ExtensionsList.Values | ForEach-Object { $totalExtensions += $_.Count }
    $currentExtension = 0
    
    foreach ($category in $ExtensionsList.Keys) {
        Write-Host "`nInstalando extensiones de: $category" -ForegroundColor Cyan
        
        foreach ($extension in $ExtensionsList[$category]) {
            $currentExtension++
            $progress = [math]::Round(($currentExtension / $totalExtensions) * 100, 1)
            
            Write-Host "  [$progress%] Instalando: $extension" -ForegroundColor Yellow
            
            try {
                $result = code --install-extension $extension 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "    Instalado correctamente" -ForegroundColor Green
                }
                else {
                    Write-Host "    Error o ya instalado: $result" -ForegroundColor Yellow
                }
            }
            catch {
                Write-Host "    Error instalando: $extension" -ForegroundColor Red
            }
            
            # Pequena pausa para evitar sobrecarga
            Start-Sleep -Milliseconds 500
        }
    }
}

# Funcion para verificar si VS Code esta instalado
function Test-VSCodeInstalled {
    try {
        $null = Get-Command code -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Funcion para verificar extensiones ya instaladas
function Get-InstalledExtensions {
    try {
        $installed = code --list-extensions 2>$null
        return $installed
    }
    catch {
        return @()
    }
}

# Funcion principal
function Main {
    Write-Host "Verificando instalacion de VS Code..." -ForegroundColor Blue
    
    if (-not (Test-VSCodeInstalled)) {
        Write-Host "VS Code no esta instalado o no esta en el PATH" -ForegroundColor Red
        Write-Host "Instala VS Code desde: https://code.visualstudio.com/" -ForegroundColor Yellow
        return
    }
    
    Write-Host "VS Code encontrado" -ForegroundColor Green
    
    # Mostrar extensiones ya instaladas
    $installedExtensions = Get-InstalledExtensions
    Write-Host "Extensiones ya instaladas: $($installedExtensions.Count)" -ForegroundColor Blue
    
    # Preguntar si continuar
    $response = Read-Host "`nDeseas continuar con la instalacion? (s/n)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "Instalacion cancelada" -ForegroundColor Red
        return
    }
    
    # Instalar extensiones
    Install-Extensions -ExtensionsList $extensions
    
    Write-Host "`nInstalacion completada!" -ForegroundColor Green
    Write-Host "Reinicia VS Code para aplicar todos los cambios" -ForegroundColor Yellow
    Write-Host "Revisa la documentacion de cada extension para configurarla" -ForegroundColor Blue
}

# Ejecutar script
Main
