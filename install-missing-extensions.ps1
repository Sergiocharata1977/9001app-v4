# Script para instalar extensiones que faltaron
# Ejecutar: .\install-missing-extensions.ps1

Write-Host "Instalando extensiones que faltaron..." -ForegroundColor Green

# Extensiones que faltaron con IDs corregidos
$missingExtensions = @(
    # ESLint y Prettier (IDs corregidos)
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    
    # Testing (IDs corregidos)
    "orta.vscode-jest",
    "cypress-io.cypress",
    
    # Extensiones adicionales utiles
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-git",
    "ms-vscode.vscode-terminal",
    
    # Analisis de codigo
    "SonarSource.sonarlint-vscode",
    "kisstkondoros.vscode-codemetrics",
    
    # CSS y Styling
    "pranaygp.vscode-css-peek",
    "naumovs.color-highlight",
    "bradlc.vscode-tailwindcss",
    
    # Snippets adicionales
    "xabikos.JavaScriptSnippets",
    "burkeholland.simple-react-snippets",
    
    # Debugging
    "ms-vscode.vscode-js-debug",
    "ms-vscode.vscode-js-debug-companion",
    
    # Utilidades adicionales
    "ms-vscode.vscode-file-utils",
    "wix.vscode-import-cost",
    "ms-vscode.vscode-coverage-gutters",
    
    # Temas adicionales
    "dracula-theme.theme-dracula",
    "zhuangtongfa.Material-theme",
    
    # Documentacion adicional
    "bierner.markdown-preview-github-styles",
    "jebbs.plantuml"
)

# Instalar cada extension
foreach ($ext in $missingExtensions) {
    Write-Host "Instalando: $ext" -ForegroundColor Yellow
    code --install-extension $ext
    Start-Sleep -Milliseconds 1000
}

Write-Host "Instalacion de extensiones faltantes completada!" -ForegroundColor Green
