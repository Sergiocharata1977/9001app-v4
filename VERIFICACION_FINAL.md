# 🔍 VERIFICACIÓN FINAL - ISOFlow4

## 🚀 **COMANDOS PARA EJECUTAR EN EL SERVIDOR**

### **1. VERIFICAR ESTADO ACTUAL**
```bash
# Estado completo del sistema
echo "=== ESTADO COMPLETO ==="
echo "PM2 Status:"
pm2 status
echo ""
echo "Puertos activos:"
netstat -tlnp | grep -E ':(80|5000)'
echo ""
echo "Nginx status:"
systemctl status nginx --no-pager
echo ""
echo "Últimos logs del backend:"
pm2 logs 9001app2-backend --lines 3
```

### **2. DIAGNÓSTICO DEL BACKEND**
```bash
# 1. Verificar que no hay errores nuevos
pm2 logs 9001app2-backend --lines 5

# 2. Verificar que el backend esté escuchando
netstat -tlnp | grep :5000

# 3. Probar la API directamente
curl -X GET http://localhost:5000/api/health

# 4. Verificar que nginx esté funcionando
systemctl status nginx

# 5. Probar la aplicación completa
curl -I http://31.97.162.229
```

### **3. VERIFICAR VARIABLES DE ENTORNO**
```bash
# Verificar archivo .env.local
echo "=== VARIABLES DE ENTORNO ==="
cd /root/9001app2/backend
ls -la .env*
echo ""
echo "Contenido de .env.local:"
cat .env.local
```

### **4. PROBAR CONEXIÓN A BASE DE DATOS**
```bash
# Verificar conexión a Turso
cd /root/9001app2/backend
node -e "
const { createClient } = require('@libsql/client');
const client = createClient({
  url: 'libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
});
client.execute('SELECT 1 as test').then(result => {
  console.log('✅ Conexión a Turso exitosa:', result);
}).catch(err => {
  console.log('❌ Error en conexión a Turso:', err.message);
});
"
```

### **5. INICIAR BACKEND MANUALMENTE**
```bash
# Detener PM2
pm2 stop 9001app2-backend

# Iniciar manualmente para ver errores
cd /root/9001app2/backend
node index.js
```

### **6. VERIFICAR FRONTEND**
```bash
# Verificar que el build existe
ls -la /root/9001app2/frontend/dist/

# Verificar configuración de nginx
cat /etc/nginx/sites-available/default

# Probar acceso al frontend
curl -I http://31.97.162.229
```

## 🎯 **RESULTADOS ESPERADOS**

### **✅ SI TODO ESTÁ BIEN:**
- PM2 muestra `9001app2-backend` como `online`
- Puerto 5000 está escuchando
- `curl http://localhost:5000/api/health` responde
- `curl http://31.97.162.229` muestra la aplicación React
- Nginx está `active (running)`

### **❌ SI HAY PROBLEMAS:**
- Backend no escucha puerto 5000 → Revisar `.env.local`
- Errores en logs → Verificar dependencias
- Nginx no funciona → Revisar configuración
- Frontend no carga → Verificar build

## 🔧 **SOLUCIONES RÁPIDAS**

### **Si el backend no escucha:**
```bash
# Revisar variables de entorno
cd /root/9001app2/backend
cat .env.local

# Verificar que PORT=5000 esté definido
grep PORT .env.local

# Si no está, añadirlo:
echo "PORT=5000" >> .env.local
```

### **Si hay errores de módulos:**
```bash
# Reinstalar dependencias
cd /root/9001app2/backend
npm install

# Reiniciar PM2
pm2 restart 9001app2-backend
```

### **Si nginx no funciona:**
```bash
# Reiniciar nginx
systemctl restart nginx

# Verificar configuración
nginx -t
```

## 📊 **CHECKLIST FINAL**

- [ ] PM2 muestra backend online
- [ ] Puerto 5000 escuchando
- [ ] API health responde
- [ ] Nginx funcionando
- [ ] Frontend accesible en http://31.97.162.229
- [ ] Base de datos Turso conectada
- [ ] Variables de entorno configuradas

## 🎉 **SI TODO ESTÁ BIEN**

¡Tu aplicación ISOFlow4 estará funcionando completamente en:
**http://31.97.162.229** 🚀

---

**Fecha**: 11/08/2025  
**Servidor**: Ubuntu 24.04.2 LTS  
**IP**: 31.97.162.229
