#!/bin/bash

# ==========================================
# SCRIPT DE DIAGNÓSTICO SERVIDOR 9001APP2
# Para ejecutar en el VPS Ubuntu
# ==========================================

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
print_status() {
    case $2 in
        "SUCCESS") echo -e "${GREEN}✅ $1${NC}" ;;
        "ERROR")   echo -e "${RED}❌ $1${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️ $1${NC}" ;;
        "INFO")    echo -e "${CYAN}ℹ️ $1${NC}" ;;
        "TITLE")   echo -e "\n${BLUE}🔍 $1${NC}" ;;
    esac
}

# Encabezado
clear
echo -e "${CYAN}===========================================${NC}"
echo -e "${CYAN} DIAGNÓSTICO SERVIDOR 9001APP2${NC}"
echo -e "${CYAN}===========================================${NC}"
echo -e "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "Servidor: $(hostname)"
echo -e "Usuario: $(whoami)"

# 1. VERIFICAR SISTEMA
print_status "VERIFICANDO ESTADO DEL SISTEMA" "TITLE"

# Uso de disco
df_output=$(df -h / | tail -1 | awk '{print $5}')
if [[ ${df_output%?} -lt 80 ]]; then
    print_status "Uso de disco: $df_output" "SUCCESS"
else
    print_status "Uso de disco ALTO: $df_output" "WARNING"
fi

# Memoria
mem_used=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
print_status "Uso de memoria: ${mem_used}%" "INFO"

# Load average
load_avg=$(uptime | awk -F'load average:' '{print $2}')
print_status "Load average:$load_avg" "INFO"

# 2. VERIFICAR SERVICIOS PM2
print_status "VERIFICANDO SERVICIOS PM2" "TITLE"

if command -v pm2 &> /dev/null; then
    print_status "PM2 está instalado" "SUCCESS"
    
    # Estado de servicios
    if pm2 describe 9001app2-backend > /dev/null 2>&1; then
        backend_status=$(pm2 describe 9001app2-backend | grep "status" | awk '{print $4}')
        if [[ "$backend_status" == "online" ]]; then
            print_status "Backend está ONLINE" "SUCCESS"
        else
            print_status "Backend está $backend_status" "ERROR"
        fi
    else
        print_status "Backend NO encontrado en PM2" "ERROR"
    fi
    
    if pm2 describe 9001app2-frontend > /dev/null 2>&1; then
        frontend_status=$(pm2 describe 9001app2-frontend | grep "status" | awk '{print $4}')
        if [[ "$frontend_status" == "online" ]]; then
            print_status "Frontend está ONLINE" "SUCCESS"
        else
            print_status "Frontend está $frontend_status" "ERROR"
        fi
    else
        print_status "Frontend NO encontrado en PM2" "ERROR"
    fi
    
    echo -e "\n${YELLOW}📊 Estado completo de PM2:${NC}"
    pm2 status
else
    print_status "PM2 NO está instalado" "ERROR"
fi

# 3. VERIFICAR NGINX
print_status "VERIFICANDO NGINX" "TITLE"

if command -v nginx &> /dev/null; then
    print_status "Nginx está instalado" "SUCCESS"
    
    # Verificar si está corriendo
    if systemctl is-active --quiet nginx; then
        print_status "Nginx está ACTIVO" "SUCCESS"
    else
        print_status "Nginx NO está activo" "ERROR"
    fi
    
    # Verificar configuración
    if nginx -t > /dev/null 2>&1; then
        print_status "Configuración de Nginx es VÁLIDA" "SUCCESS"
    else
        print_status "Configuración de Nginx tiene ERRORES" "ERROR"
        echo -e "${YELLOW}Detalles del error:${NC}"
        nginx -t
    fi
else
    print_status "Nginx NO está instalado" "ERROR"
fi

# 4. VERIFICAR PUERTOS
print_status "VERIFICANDO PUERTOS" "TITLE"

# Puerto 3000 (Frontend)
if netstat -tlnp | grep :3000 > /dev/null 2>&1; then
    print_status "Puerto 3000 (Frontend) está ESCUCHANDO" "SUCCESS"
else
    print_status "Puerto 3000 (Frontend) NO está escuchando" "ERROR"
fi

# Puerto 5000 (Backend)
if netstat -tlnp | grep :5000 > /dev/null 2>&1; then
    print_status "Puerto 5000 (Backend) está ESCUCHANDO" "SUCCESS"
else
    print_status "Puerto 5000 (Backend) NO está escuchando" "ERROR"
fi

# Puerto 80 (Nginx)
if netstat -tlnp | grep :80 > /dev/null 2>&1; then
    print_status "Puerto 80 (HTTP) está ESCUCHANDO" "SUCCESS"
else
    print_status "Puerto 80 (HTTP) NO está escuchando" "WARNING"
fi

# 5. VERIFICAR CONECTIVIDAD INTERNA
print_status "VERIFICANDO CONECTIVIDAD INTERNA" "TITLE"

# Backend health check
if curl -s http://localhost:5000/api/health > /dev/null; then
    health_response=$(curl -s http://localhost:5000/api/health)
    print_status "Backend Health Check: OK" "SUCCESS"
    echo -e "${GREEN}   Respuesta: $health_response${NC}"
else
    print_status "Backend Health Check: FALLA" "ERROR"
fi

# Frontend
if curl -s http://localhost:3000 > /dev/null; then
    print_status "Frontend responde localmente" "SUCCESS"
else
    print_status "Frontend NO responde localmente" "ERROR"
fi

# 6. VERIFICAR LOGS RECIENTES
print_status "VERIFICANDO LOGS RECIENTES" "TITLE"

echo -e "${YELLOW}📝 Últimas 5 líneas del log de backend:${NC}"
pm2 logs 9001app2-backend --lines 5 --nostream 2>/dev/null || echo "No se pudieron obtener logs del backend"

echo -e "\n${YELLOW}📝 Últimas 5 líneas del log de frontend:${NC}"
pm2 logs 9001app2-frontend --lines 5 --nostream 2>/dev/null || echo "No se pudieron obtener logs del frontend"

# 7. VERIFICAR ARCHIVOS DEL PROYECTO
print_status "VERIFICANDO ARCHIVOS DEL PROYECTO" "TITLE"

PROJECT_DIR="/root/9001app2"  # Ajustar según ubicación real

if [[ -d "$PROJECT_DIR" ]]; then
    print_status "Directorio del proyecto existe: $PROJECT_DIR" "SUCCESS"
    
    # Verificar archivos importantes
    if [[ -f "$PROJECT_DIR/frontend/dist/index.html" ]]; then
        print_status "Build del frontend existe" "SUCCESS"
    else
        print_status "Build del frontend NO existe" "ERROR"
    fi
    
    if [[ -f "$PROJECT_DIR/backend/package.json" ]]; then
        print_status "package.json del backend existe" "SUCCESS"
    else
        print_status "package.json del backend NO existe" "ERROR"
    fi
else
    print_status "Directorio del proyecto NO encontrado: $PROJECT_DIR" "ERROR"
fi

# 8. COMANDOS ÚTILES
print_status "COMANDOS ÚTILES PARA RESOLUCIÓN" "TITLE"

echo -e "${YELLOW}🔧 Comandos de PM2:${NC}"
echo -e "${NC}pm2 restart 9001app2-backend    # Reiniciar backend${NC}"
echo -e "${NC}pm2 restart 9001app2-frontend   # Reiniciar frontend${NC}"
echo -e "${NC}pm2 logs 9001app2-backend      # Ver logs backend${NC}"
echo -e "${NC}pm2 logs 9001app2-frontend     # Ver logs frontend${NC}"
echo -e "${NC}pm2 monit                      # Monitor en tiempo real${NC}"

echo -e "\n${YELLOW}🌐 Comandos de Nginx:${NC}"
echo -e "${NC}nginx -t                       # Verificar configuración${NC}"
echo -e "${NC}nginx -s reload               # Recargar configuración${NC}"
echo -e "${NC}systemctl restart nginx       # Reiniciar nginx${NC}"

echo -e "\n${YELLOW}🚀 Comando de despliegue:${NC}"
echo -e "${NC}/root/deploy-9001app2.sh      # Despliegue automático completo${NC}"

echo -e "\n${GREEN}✅ DIAGNÓSTICO DEL SERVIDOR COMPLETADO${NC}"
echo -e "${CYAN}===========================================${NC}"
