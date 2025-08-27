#!/bin/bash

echo "🚀 Configurando Codespace para Proyecto ISO 9001..."

# Actualizar sistema
sudo apt-get update

# Instalar herramientas adicionales
sudo apt-get install -y curl wget git

# Instalar Node.js 18 (si no está disponible)
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Instalar Turso CLI
if ! command -v turso &> /dev/null; then
    echo "Instalando Turso CLI..."
    curl -sSfL https://get.tur.so/install.sh | bash
    export PATH="$HOME/.turso:$PATH"
fi

# Instalar dependencias del proyecto
echo "Instalando dependencias..."
npm install

# Configurar base de datos local
echo "Configurando base de datos..."
if [ ! -f "isoflow4.db" ]; then
    npx turso db create isoflow4 --local
fi

# Ejecutar migraciones
echo "Ejecutando migraciones..."
npm run migrate || echo "No se encontró script de migración"

# Configurar variables de entorno
if [ ! -f ".env" ]; then
    echo "Configurando variables de entorno..."
    cp env.example .env 2>/dev/null || echo "No se encontró env.example"
fi

# Configurar Git
git config --global user.name "Codespace User"
git config --global user.email "codespace@example.com"

# Crear directorio de datos si no existe
mkdir -p .devcontainer/data

echo "✅ Codespace configurado correctamente!"
echo "🎯 Puedes comenzar a desarrollar directamente en el servidor"
echo "📊 Base de datos: isoflow4.db"
echo "🌐 Servidor: http://localhost:3000"
echo "⚡ Frontend: http://localhost:5173"
