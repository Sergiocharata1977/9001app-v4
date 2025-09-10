# Script para subir el proyecto al repositorio GitHub
# Ejecutar desde la raíz del proyecto

Write-Host "🚀 Subiendo proyecto ISO 9001 a GitHub..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: No se encontró la carpeta 'backend'. Ejecutar desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Inicializar git si no existe
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
}

# Agregar remote origin
Write-Host "🔗 Configurando repositorio remoto..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/Sergiocharata1977/9001app-v4.git

# Agregar todos los archivos
Write-Host "📁 Agregando archivos al staging..." -ForegroundColor Yellow
git add .

# Commit inicial
Write-Host "💾 Creando commit inicial..." -ForegroundColor Yellow
git commit -m "🚀 Initial commit: Backend ISO 9001 con autenticación y RRHH

✅ Características implementadas:
- Sistema de autenticación JWT multi-tenant
- Modelos de usuarios y organizaciones
- Middleware de autenticación y manejo de errores
- Estructura modular con TypeScript ES6
- Configuración MongoDB con Mongoose
- Rutas de autenticación y usuarios
- Documentación completa

🎯 Próximos pasos:
- Completar módulos RRHH (departamentos, puestos, personal)
- Integrar con frontend existente
- Implementar validaciones con Joi"

# Push al repositorio
Write-Host "⬆️ Subiendo al repositorio GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host "✅ ¡Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
Write-Host "🔗 Repositorio: https://github.com/Sergiocharata1977/9001app-v4" -ForegroundColor Cyan
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Abrir Cursor Web con el repositorio" -ForegroundColor White
Write-Host "   2. Continuar desarrollo de módulos RRHH" -ForegroundColor White
Write-Host "   3. Integrar con frontend existente" -ForegroundColor White
