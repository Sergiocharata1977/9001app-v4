const fs = require('fs');
const path = require('path');

// Nuevo token de Turso
const newToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTQ1NjMyNzAsImlkIjoiYjRjZTU4MWItZjc3Yy00OTY4LTgxODYtNjEwM2E4MmY0NWQxIiwicmlkIjoiMmI4MTUwOWEtYWQ2Yy00NThkLTg2OTMtYjQ3ZDQ1OWFkYWNiIn0.6P3mNGSjStQv17bQO3936z9ZH23CsbnRLgOLQBxCNMFHReHHqXlwpkljKlzciVy_UQr3LJxqv72UxQo6fpsGAw';

// Leer el archivo .env
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Actualizar el token
envContent = envContent.replace(
  /TURSO_AUTH_TOKEN=.*/,
  `TURSO_AUTH_TOKEN=${newToken}`
);

// Escribir el archivo actualizado
fs.writeFileSync(envPath, envContent);

console.log('✅ Token de Turso actualizado correctamente');
console.log('🔄 Reiniciando servidor...');
