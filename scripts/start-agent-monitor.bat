@echo off
echo 🤖 Iniciando Monitor de Agentes...
echo.

REM Verificar que Node.js esté instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    pause
    exit /b 1
)

REM Verificar que PM2 esté instalado
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Instalando PM2...
    npm install -g pm2
)

REM Crear directorio de logs si no existe
if not exist "logs" mkdir logs

REM Iniciar monitor con PM2
echo 🚀 Iniciando monitor de agentes con PM2...
pm2 start scripts/pm2-agent-monitor.config.js

echo.
echo ✅ Monitor de agentes iniciado
echo 📊 Ver logs: pm2 logs agent-monitor
echo 🛑 Detener: pm2 stop agent-monitor
echo 🔄 Reiniciar: pm2 restart agent-monitor
echo.
pause
