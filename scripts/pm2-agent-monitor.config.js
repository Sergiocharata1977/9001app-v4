module.exports = {
  apps: [
    {
      name: 'agent-monitor',
      script: 'scripts/agent-monitor.js',
      args: 'continuous',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        BACKEND_URL: 'http://localhost:5000',
        FRONTEND_URL: 'http://localhost:3000'
      },
      error_file: './logs/agent-monitor-error.log',
      out_file: './logs/agent-monitor-out.log',
      log_file: './logs/agent-monitor-combined.log',
      time: true
    }
  ]
};
