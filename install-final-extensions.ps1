# Script final para instalar extensiones que faltaron
# Ejecutar: .\install-final-extensions.ps1

Write-Host "Instalando extensiones finales..." -ForegroundColor Green

# Extensiones que faltaron con IDs corregidos
$finalExtensions = @(
    # ESLint y Prettier (IDs corregidos)
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    
    # Testing (IDs corregidos)
    "orta.vscode-jest",
    
    # Extensiones de VS Code (ya vienen incluidas)
    # "ms-vscode.vscode-json" - Ya incluida en VS Code
    # "ms-vscode.vscode-git" - Ya incluida en VS Code
    # "ms-vscode.vscode-terminal" - Ya incluida en VS Code
    
    # Debugging (IDs corregidos)
    "ms-vscode.js-debug",
    "ms-vscode.js-debug-companion",
    
    # Utilidades adicionales
    "sleistner.vscode-fileutils",
    "ryanluker.vscode-coverage-gutters",
    
    # Extensiones adicionales utiles
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-git",
    "ms-vscode.vscode-terminal"
)

# Instalar cada extension
foreach ($ext in $finalExtensions) {
    Write-Host "Instalando: $ext" -ForegroundColor Yellow
    code --install-extension $ext
    Start-Sleep -Milliseconds 1000
}

Write-Host "Instalacion final completada!" -ForegroundColor Green
