# ===============================================
# SCRIPT DE MIGRACIÓN ISOFLOW4 A 9001APP2
# ===============================================

Write-Host "🚀 Iniciando migración de ISOFlow4 a 9001app2..." -ForegroundColor Green

# 1. Limpiar estructura actual
Write-Host "📁 Limpiando estructura actual..." -ForegroundColor Yellow
Remove-Item -Path "frontend\src\src" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend\src\App.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend\src\main.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend\src\vite-env.d.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend\src\App.css" -Force -ErrorAction SilentlyContinue

# 2. Copiar archivos de ISOFlow4
Write-Host "📋 Copiando archivos de ISOFlow4..." -ForegroundColor Yellow

# Copiar archivos principales
Copy-Item -Path "..\frontend\src\App.jsx" -Destination "frontend\src\" -Force
Copy-Item -Path "..\frontend\src\main.jsx" -Destination "frontend\src\" -Force
Copy-Item -Path "..\frontend\src\index.css" -Destination "frontend\src\" -Force

# Copiar carpetas completas
$folders = @(
    "components",
    "pages", 
    "services",
    "hooks",
    "context",
    "lib",
    "config",
    "routes",
    "store",
    "utils",
    "schemas",
    "assets",
    "data",
    "docs",
    "types",
    "styles"
)

foreach ($folder in $folders) {
    if (Test-Path "..\frontend\src\$folder") {
        Write-Host "📁 Copiando $folder..." -ForegroundColor Cyan
        Copy-Item -Path "..\frontend\src\$folder" -Destination "frontend\src\" -Recurse -Force
    }
}

# 3. Copiar archivos de configuración
Write-Host "⚙️ Copiando archivos de configuración..." -ForegroundColor Yellow
Copy-Item -Path "..\frontend\package.json" -Destination "frontend\" -Force
Copy-Item -Path "..\frontend\tailwind.config.js" -Destination "frontend\" -Force
Copy-Item -Path "..\frontend\postcss.config.js" -Destination "frontend\" -Force
Copy-Item -Path "..\frontend\vite.config.js" -Destination "frontend\" -Force

# 4. Copiar backend completo
Write-Host "🔧 Copiando backend..." -ForegroundColor Yellow
if (Test-Path "..\backend") {
    Copy-Item -Path "..\backend" -Destination "." -Recurse -Force
}

# 5. Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
Set-Location "frontend"
npm install

# 6. Verificar estructura
Write-Host "✅ Verificando estructura..." -ForegroundColor Green
Set-Location ".."
Write-Host "📁 Estructura final:" -ForegroundColor Green
Get-ChildItem -Path "frontend\src" -Recurse -Directory | Select-Object FullName

Write-Host "🎉 ¡Migración completada!" -ForegroundColor Green
Write-Host "📝 Para ejecutar: cd frontend && npm run dev" -ForegroundColor Cyan 