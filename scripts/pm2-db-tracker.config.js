module.exports = {
  apps: [
    {
      name: 'db-tracker',
      script: 'scripts/database-tracker.js',
      args: 'continuous',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        DB_URL: 'file:data.db',
        DB_TOKEN: process.env.DB_TOKEN
      },
      error_file: './logs/db-tracker-error.log',
      out_file: './logs/db-tracker-out.log',
      log_file: './logs/db-tracker-combined.log',
      time: true,
      cron_restart: '0 */12 * * *' // Reiniciar cada 12 horas
    }
  ]
};
