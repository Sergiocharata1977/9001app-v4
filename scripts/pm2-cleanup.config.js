module.exports = {
  apps: [
    {
      name: 'cleanup-system',
      script: 'scripts/cleanup-system.js',
      args: 'continuous',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/cleanup-error.log',
      out_file: './logs/cleanup-out.log',
      log_file: './logs/cleanup-combined.log',
      time: true,
      cron_restart: '0 0 */2 * *' // Reiniciar cada 2 días a las 00:00
    }
  ]
};
