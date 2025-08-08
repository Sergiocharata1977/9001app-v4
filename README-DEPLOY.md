# 🚀 Despliegue Automático 9001APP2

## 📋 Descripción

Este sistema permite el despliegue automático de la aplicación 9001APP2 desde GitLab al servidor VPS de Hostinger.

## 📁 Archivos Incluidos

- `deploy-server.sh` - Script principal de despliegue
- `setup-server.sh` - Script de configuración inicial del servidor
- `README-DEPLOY.md` - Esta documentación

## 🔧 Configuración Inicial del Servidor

### Paso 1: Subir archivos al repositorio
```bash
git add .
git commit -m "feat: scripts de despliegue automático"
git push origin master
```

### Paso 2: En el servidor VPS
```bash
# Navegar al directorio del proyecto
cd ~/9001app2

# Hacer el script ejecutable
chmod +x deploy-server.sh
chmod +x setup-server.sh

# Ejecutar configuración inicial (solo una vez)
./setup-server.sh
```

## 🚀 Despliegue Automático

### Opción 1: Despliegue Manual
```bash
# En el servidor VPS
cd ~/9001app2
./deploy-server.sh
```

### Opción 2: Despliegue Automático con GitLab CI (recomendado)
1. Agrega `.gitlab-ci.yml` con un job de deploy por SSH
2. Configura variables seguras: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`
3. El job ejecutará `deploy-server.sh` en el VPS

### Opción 3: Cron (temporal, no recomendado)
Si no usas CI aún, puedes mantener un cron que ejecute `deploy-server.sh`, pero no es la opción recomendada.

## 📊 Monitoreo

### Verificar estado de servicios
```bash
# Ver servicios PM2
pm2 list

# Ver logs
pm2 logs

# Ver logs de despliegue
tail -f /root/deploy.log
```

### URLs de acceso
- **Frontend (Nginx)**: `http://31.97.162.229`
- **Backend directo**: `http://31.97.162.229:5000`
- **API vía Nginx**: `http://31.97.162.229/api/*`

## 🔍 Troubleshooting

### Problemas comunes:

1. **Error de permisos**
```bash
chmod +x deploy-server.sh
```

2. **Node.js desactualizado (react-router >=7 requiere Node >=20)**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
```

3. **PM2 no instalado**
```bash
npm install -g pm2
```

4. **Puerto ocupado**
```bash
# Ver qué está usando el puerto
lsof -i :3000
lsof -i :5000

# Matar proceso
kill -9 <PID>
```

## 📝 Logs

- **Despliegue**: `/root/deploy.log`
- **Configuración**: `/root/setup.log`
- **PM2**: `pm2 logs`

## 🔄 Flujo de Trabajo

1. **Desarrollo local** → Cambios en código
2. **Commit y Push** → Subir a GitLab
3. **Despliegue automático** → Servidor detecta cambios
4. **Verificación** → Comprobar funcionamiento

## ⚙️ Configuración Avanzada

### Variables de entorno
```bash
# En el servidor
cd ~/9001app2/backend
cp .env.example .env
nano .env
```

### Configurar Nginx
- Servir estáticos desde `/var/www/9001app2/dist` y proxy `/api` a `http://127.0.0.1:5000`.
```bash
nginx -t && systemctl reload nginx
```

### Configurar SSL (opcional)
```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d tu-dominio.com
```

## 🎯 Estado del Proyecto

- ✅ **Frontend**: Servido por Nginx (puerto 80)
- ✅ **Backend**: PM2 gestionando `9001app2-backend`
- ✅ **Nginx**: Sirve estáticos y proxy `/api`
- ✅ **Logs**: Sistema de logging activo

## 📞 Soporte

Para problemas o consultas:
1. Revisar logs: `tail -f /root/deploy.log`
2. Verificar servicios: `pm2 list`
3. Revisar configuración: `./setup-server.sh`

---

**Última actualización**: $(date)
**Versión**: 1.0.0 