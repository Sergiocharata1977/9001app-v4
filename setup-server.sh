#!/bin/bash
set -euo pipefail

# ===============================================
# SCRIPT DE CONFIGURACIÓN RÁPIDA DEL SERVIDOR
# 9001APP2 - Hostinger VPS
# ===============================================

echo "🔧 Configurando servidor para 9001APP2..."
echo "📅 Fecha: $(date)"
echo "🌐 Servidor: 31.97.162.229"
echo "=============================================="

# Variables
PROJECT_DIR="/root/9001app2"
STATIC_ROOT="/var/www/9001app2"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Función de error
error() {
    log "❌ ERROR: $1"
    exit 1
}

# Función de éxito
success() {
    log "✅ $1"
}

# 1. ACTUALIZAR SISTEMA
log "🔄 Actualizando sistema..."
apt update && apt upgrade -y
success "Sistema actualizado"

# 2. INSTALAR DEPENDENCIAS
log "📦 Instalando dependencias..."
apt install -y curl wget git nginx nodejs npm pm2 rsync

# Verificar versiones
log "📋 Verificando versiones instaladas..."
node --version
npm --version
pm2 --version
nginx -v

success "Dependencias instaladas"

# 3. CONFIGURAR NGINX
log "🌐 Configurando Nginx..."

# Crear directorio para archivos estáticos
mkdir -p $STATIC_ROOT

# Crear configuración de Nginx
cat > /etc/nginx/sites-available/9001app2 << 'EOF'
server {
    listen 80;
    server_name 31.97.162.229;
    
    # Frontend estático
    location / {
        root /var/www/9001app2/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000/api/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/9001app2 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t
systemctl restart nginx
systemctl enable nginx

success "Nginx configurado"

# 4. CONFIGURAR PM2
log "⚙️ Configurando PM2..."
pm2 startup
pm2 install pm2-logrotate

# Configurar logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

success "PM2 configurado"

# 5. CONFIGURAR DIRECTORIOS
log "📁 Configurando directorios..."
mkdir -p /var/log/pm2
mkdir -p $STATIC_ROOT/dist
chown -R www-data:www-data $STATIC_ROOT
chmod -R 755 $STATIC_ROOT

success "Directorios configurados"

# 6. CONFIGURAR FIREWALL (opcional)
log "🔥 Configurando firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

success "Firewall configurado"

# 7. CLONAR REPOSITORIO (si no existe)
if [ ! -d "$PROJECT_DIR" ]; then
    log "📥 Clonando repositorio..."
    cd /root
    git clone https://github.com/Sergiocharata1977/9001app.git 9001app2
    success "Repositorio clonado"
else
    log "📁 Repositorio ya existe"
fi

# 8. CONFIGURAR VARIABLES DE ENTORNO
log "🔧 Configurando variables de entorno..."
if [ -f "$PROJECT_DIR/backend/.env.example" ]; then
    cp "$PROJECT_DIR/backend/.env.example" "$PROJECT_DIR/backend/.env"
    log "⚠️ Archivo .env creado desde ejemplo. Configura las variables necesarias."
fi

# 9. INSTALAR DEPENDENCIAS DEL PROYECTO
log "📦 Instalando dependencias del proyecto..."

# Frontend
cd "$PROJECT_DIR/frontend"
npm install --production=false

# Backend
cd "$PROJECT_DIR/backend"
npm install --production=false

success "Dependencias del proyecto instaladas"

# 10. CONFIGURAR LOGS
log "📝 Configurando logs..."
mkdir -p /var/log/9001app2
touch /var/log/9001app2/app.log
chmod 644 /var/log/9001app2/app.log

# 11. RESUMEN FINAL
echo ""
echo "=============================================="
success "CONFIGURACIÓN DEL SERVIDOR COMPLETADA"
echo "📊 Resumen de la configuración:"
echo "   - Nginx: Configurado y funcionando"
echo "   - PM2: Instalado y configurado"
echo "   - Node.js: $(node --version)"
echo "   - NPM: $(npm --version)"
echo "   - Directorio proyecto: $PROJECT_DIR"
echo "   - Directorio estático: $STATIC_ROOT"
echo "   - Logs: /var/log/9001app2/"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. Configurar variables de entorno en $PROJECT_DIR/backend/.env"
echo "   2. Ejecutar: ./deploy-automated.sh"
echo "   3. Verificar: http://31.97.162.229/"
echo "=============================================="

success "Configuración completada en $(date)" 