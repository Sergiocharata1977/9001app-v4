#!/bin/bash

# ==========================================
# SCRIPT PARA ARREGLAR NGINX SPA ROUTING
# Soluciona ERROR 404 en rutas como /login
# ==========================================

echo "🔧 ARREGLANDO NGINX PARA SPA ROUTING..."
echo "========================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar si somos root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Este script debe ejecutarse como root${NC}"
   exit 1
fi

# Hacer backup de la configuración actual
echo -e "${YELLOW}📄 Haciendo backup de configuración actual...${NC}"
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✅ Backup guardado${NC}"

# Verificar configuración actual
echo -e "${YELLOW}🔍 Verificando configuración actual...${NC}"
if grep -q "try_files" /etc/nginx/sites-available/default; then
    echo -e "${YELLOW}⚠️ Ya existe configuración try_files${NC}"
else
    echo -e "${RED}❌ No existe configuración try_files para SPA${NC}"
fi

# Crear nueva configuración nginx
echo -e "${YELLOW}⚙️ Creando nueva configuración nginx...${NC}"

cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    # CONFIGURACIÓN PARA FRONTEND SPA (Puerto 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CRUCIAL: Esta línea arregla el SPA routing
        try_files $uri $uri/ @fallback;
    }

    # Fallback para SPA routing
    location @fallback {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # CONFIGURACIÓN PARA BACKEND API (Puerto 5000)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo -e "${GREEN}✅ Nueva configuración creada${NC}"

# Verificar sintaxis de nginx
echo -e "${YELLOW}🧪 Verificando sintaxis de nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Configuración de nginx es VÁLIDA${NC}"
    
    # Reiniciar nginx
    echo -e "${YELLOW}🔄 Reiniciando nginx...${NC}"
    systemctl reload nginx
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx reiniciado correctamente${NC}"
    else
        echo -e "${RED}❌ Error reiniciando nginx${NC}"
        systemctl status nginx
        exit 1
    fi
else
    echo -e "${RED}❌ Error en configuración de nginx${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default
    nginx -s reload
    exit 1
fi

# Verificar que los servicios estén corriendo
echo -e "${YELLOW}🏥 Verificando servicios...${NC}"

# Verificar frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend (puerto 3000) está respondiendo${NC}"
else
    echo -e "${RED}❌ Frontend (puerto 3000) NO responde${NC}"
    echo -e "${YELLOW}Verificando PM2...${NC}"
    pm2 status
fi

# Verificar backend
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend (puerto 5000) está respondiendo${NC}"
else
    echo -e "${RED}❌ Backend (puerto 5000) NO responde${NC}"
    echo -e "${YELLOW}Verificando PM2...${NC}"
    pm2 status
fi

echo ""
echo -e "${GREEN}🎉 CONFIGURACIÓN COMPLETADA${NC}"
echo "========================================"
echo -e "${BLUE}📋 RESUMEN:${NC}"
echo "• ✅ Backup de configuración anterior guardado"
echo "• ✅ Nueva configuración nginx con SPA routing"
echo "• ✅ Nginx reiniciado y funcionando"
echo "• ✅ Proxy configurado para frontend (puerto 3000)"
echo "• ✅ Proxy configurado para backend API (puerto 5000)"
echo ""
echo -e "${YELLOW}🧪 PRUEBAS RECOMENDADAS:${NC}"
echo "1. Visitar: http://31.97.162.229/login"
echo "2. Visitar: http://31.97.162.229/register"
echo "3. Visitar: http://31.97.162.229/api/health"
echo "4. Probar el botón 'Acceder al Sistema'"
echo ""
echo -e "${GREEN}✨ El problema de SPA routing debería estar SOLUCIONADO${NC}"




