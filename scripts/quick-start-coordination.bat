@echo off
echo 🤝 SISTEMA DE COORDINACIÓN SIMPLIFICADO
echo ======================================
echo.

echo 🔍 Verificando dependencias...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

echo.
echo 🧪 Probando sistema de coordinación...
node scripts/test-coordination.js

echo.
echo 📝 Actualizando documento de coordinación...
node scripts/agent-monitor.js --update-only

echo.
echo 🚀 Iniciando monitoreo automático...
echo ⏰ El sistema se actualizará cada 15 minutos
echo 📊 Ver en Super Admin: /super-admin/coordinacion-documento
echo.

echo ¿Deseas iniciar el monitoreo continuo con PM2? (s/n)
set /p choice=

if /i "%choice%"=="s" (
    echo.
    echo 🔄 Iniciando monitoreo continuo...
    pm2 start scripts/pm2-agent-monitor.config.js
    echo.
    echo ✅ Monitoreo iniciado
    echo 📊 Ver logs: pm2 logs agent-monitor
    echo 🛑 Detener: pm2 stop agent-monitor
) else (
    echo.
    echo ℹ️  Para iniciar monitoreo manualmente:
    echo    npm run agent-monitor:start
)

echo.
echo 🎉 Sistema de coordinación listo
echo.
pause
