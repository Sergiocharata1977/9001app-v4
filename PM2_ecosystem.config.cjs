module.exports = {
  apps: [
    {
      name: '9001app2-backend',
      script: 'backend/index.js',
      cwd: '/var/www/9001app2',
      instances: 1,
      exec_mode: 'fork',
      watch: false, // No watch en producción
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/pm2/9001app2-backend-error.log',
      out_file: '/var/log/pm2/9001app2-backend-out.log',
      log_file: '/var/log/pm2/9001app2-backend.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    }
  ]
};
