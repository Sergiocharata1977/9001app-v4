@echo off
echo 🤝 SISTEMA DE COORDINACIÓN COMPLETO
echo ===================================
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
echo 🗄️ Actualizando seguimiento de BD...
node scripts/database-tracker.js

echo.
echo 🚀 Iniciando sistemas automáticos...
echo ⏰ Monitoreo de agentes: cada 15 minutos
echo ⏰ Rastreador de BD: cada 12 horas
echo 📊 Ver en Super Admin: /super-admin/coordinacion-documento
echo.

echo ¿Deseas iniciar los sistemas continuos con PM2? (s/n)
set /p choice=

if /i "%choice%"=="s" (
    echo.
    echo 🔄 Iniciando monitoreo de agentes...
    pm2 start scripts/pm2-agent-monitor.config.js
    
    echo.
    echo 🔄 Iniciando rastreador de BD...
    pm2 start scripts/pm2-db-tracker.config.js
    
    echo.
    echo ✅ Sistemas iniciados
    echo 📊 Ver logs de agentes: pm2 logs agent-monitor
    echo 📊 Ver logs de BD: pm2 logs db-tracker
    echo 🛑 Detener todo: pm2 stop all
) else (
    echo.
    echo ℹ️  Para iniciar manualmente:
    echo    npm run agent-monitor:start
    echo    npm run db-tracker:start
)

echo.
echo 🎉 Sistema de coordinación completo listo
echo.
pause
