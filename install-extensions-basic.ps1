# Script basico para instalar extensiones esenciales
# Ejecutar: .\install-extensions-basic.ps1

Write-Host "Instalando extensiones esenciales..." -ForegroundColor Green

# Extensiones esenciales para el proyecto ISO 9001
$extensions = @(
    # PowerShell
    "ms-vscode.powershell",
    "ms-vscode.powershell-preview",
    
    # Base de Datos
    "qwtel.sqlite-viewer",
    "mtxr.sqltools",
    "mtxr.sqltools-driver-sqlite",
    
    # TypeScript y React
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-prettier",
    "dsznajder.es7-react-js-snippets",
    
    # Git
    "eamodio.gitlens",
    "mhutchie.git-graph",
    
    # Testing
    "ms-vscode.vscode-jest",
    "ms-vscode.vscode-cypress",
    
    # IA
    "GitHub.copilot",
    "TabNine.tabnine-vscode",
    
    # Productividad
    "formulahendry.auto-rename-tag",
    "formulahendry.auto-close-tag",
    "christian-kohler.path-intellisense",
    
    # Temas
    "PKief.material-icon-theme",
    "Equinusocio.vsc-material-theme",
    
    # Documentacion
    "yzhang.markdown-all-in-one",
    "hediet.vscode-drawio"
)

# Instalar cada extension
foreach ($ext in $extensions) {
    Write-Host "Instalando: $ext" -ForegroundColor Yellow
    code --install-extension $ext
    Start-Sleep -Milliseconds 1000
}

Write-Host "Instalacion completada!" -ForegroundColor Green
