#!/bin/bash

echo "🤖 Iniciando Monitor de Agentes..."
echo

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar que PM2 esté instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar monitor con PM2
echo "🚀 Iniciando monitor de agentes con PM2..."
pm2 start scripts/pm2-agent-monitor.config.js

echo
echo "✅ Monitor de agentes iniciado"
echo "📊 Ver logs: pm2 logs agent-monitor"
echo "🛑 Detener: pm2 stop agent-monitor"
echo "🔄 Reiniciar: pm2 restart agent-monitor"
echo
