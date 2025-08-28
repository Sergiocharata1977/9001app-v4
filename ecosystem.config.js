module.exports = {
  apps: [
    // 🧪 APLICACIÓN DE STAGING/PRUEBA
    {
      name: '9001app-staging',
      script: './backend/dist/index.js',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'staging',
        PORT: 5001,
        DB_URL: process.env.STAGING_DB_URL || 'mongodb://localhost:27017/9001app_staging',
        JWT_SECRET: process.env.STAGING_JWT_SECRET || 'staging-secret-key',
        FRONTEND_URL: 'http://localhost:3002',
        API_BASE_URL: 'http://localhost:5001/api'
      },
      env_file: '.env.staging',
      log_file: './logs/staging.log',
      error_file: './logs/staging-error.log',
      out_file: './logs/staging-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },

    // 🎯 APLICACIÓN DE PRODUCCIÓN
    {
      name: '9001app-production',
      script: './backend/dist/index.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        DB_URL: process.env.PROD_DB_URL || 'mongodb://localhost:27017/9001app_production',
        JWT_SECRET: process.env.PROD_JWT_SECRET || 'production-secret-key',
        FRONTEND_URL: 'https://9001app.com',
        API_BASE_URL: 'https://api.9001app.com'
      },
      env_file: '.env.production',
      log_file: './logs/production.log',
      error_file: './logs/production-error.log',
      out_file: './logs/production-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },

    // 🌐 FRONTEND STAGING
    {
      name: '9001app-frontend-staging',
      script: 'npm',
      args: 'run preview',
      cwd: './frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'staging',
        PORT: 3002,
        VITE_API_BASE_URL: 'http://localhost:5001/api'
      },
      log_file: './logs/frontend-staging.log',
      error_file: './logs/frontend-staging-error.log'
    },

    // 🌐 FRONTEND PRODUCCIÓN
    {
      name: '9001app-frontend-production',
      script: 'npm',
      args: 'run preview',
      cwd: './frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        VITE_API_BASE_URL: 'https://api.9001app.com'
      },
      log_file: './logs/frontend-production.log',
      error_file: './logs/frontend-production-error.log'
    }
  ],

  // 🔄 Configuración de deploy
  deploy: {
    staging: {
      user: 'deploy',
      host: 'staging.9001app.com',
      ref: 'origin/develop',
      repo: 'https://github.com/Sergiocharata1977/9001app-v2.git',
      path: '/var/www/9001app-staging',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env staging'
    },
    production: {
      user: 'deploy',
      host: '9001app.com',
      ref: 'origin/main',
      repo: 'https://github.com/Sergiocharata1977/9001app-v2.git',
      path: '/var/www/9001app',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
