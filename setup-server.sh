#!/bin/bash

# ===============================================
# SCRIPT DE CONFIGURACIÓN INICIAL DEL SERVIDOR
# ===============================================

echo "🔧 Configurando servidor para ISO Flow..."
echo "📅 Fecha: $(date)"
echo "=============================================="

# Variables
PROJECT_DIR="/root/9001app2"
LOG_FILE="/root/setup.log"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Función de error
error() {
    log "❌ ERROR: $1"
    exit 1
}

# 1. INSTALAR DEPENDENCIAS DEL SISTEMA
log "📦 Instalando dependencias del sistema..."
apt update
apt install -y curl wget git nginx

# 2. INSTALAR NODE.JS (si no está instalado)
if ! command -v node &> /dev/null; then
    log "📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    log "✅ Node.js ya está instalado"
fi

# 3. INSTALAR PM2
if ! command -v pm2 &> /dev/null; then
    log "📦 Instalando PM2..."
    npm install -g pm2
else
    log "✅ PM2 ya está instalado"
fi

# 4. INSTALAR SERVE PARA FRONTEND
log "📦 Instalando serve para frontend..."
npm install -g serve

# 5. CONFIGURAR PERMISOS
log "🔐 Configurando permisos..."
chmod +x $PROJECT_DIR/deploy-server.sh

# 6. CREAR DIRECTORIO DE LOGS
log "📁 Creando directorio de logs..."
mkdir -p /root/logs

# 7. CONFIGURAR NGINX (opcional)
log "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/isoflow << EOF
server {
    listen 80;
    server_name 31.97.162.229;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/isoflow /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Reiniciar nginx
systemctl restart nginx

# 8. CONFIGURAR FIREWALL
log "🔥 Configurando firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 5000
ufw --force enable

# 9. CONFIGURAR CRON PARA AUTO-DESPLIEGUE
log "⏰ Configurando cron para auto-despliegue..."
echo "*/5 * * * * cd $PROJECT_DIR && git fetch origin && git reset --hard origin/master && ./deploy-server.sh" | crontab -

# 10. VERIFICAR INSTALACIÓN
log "🔍 Verificando instalación..."

# Verificar Node.js
if command -v node &> /dev/null; then
    log "✅ Node.js: $(node --version)"
else
    error "❌ Node.js no está instalado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    log "✅ npm: $(npm --version)"
else
    error "❌ npm no está instalado"
fi

# Verificar PM2
if command -v pm2 &> /dev/null; then
    log "✅ PM2: $(pm2 --version)"
else
    error "❌ PM2 no está instalado"
fi

# Verificar git
if command -v git &> /dev/null; then
    log "✅ Git: $(git --version)"
else
    error "❌ Git no está instalado"
fi

# 11. RESUMEN FINAL
log "🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE"
log "📊 Resumen de configuración:"
log "   - Node.js: Instalado"
log "   - PM2: Instalado"
log "   - Nginx: Configurado"
log "   - Firewall: Configurado"
log "   - Cron: Configurado para auto-despliegue"
log "   - Scripts: Permisos configurados"
log "=============================================="

echo "✅ Configuración completada en $(date)"
echo "🚀 El servidor está listo para recibir despliegues automáticos" 