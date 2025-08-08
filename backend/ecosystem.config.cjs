module.exports = {
  apps: [
    {
      name: '9001app2-backend',
      script: 'index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      watch: false,
      max_memory_restart: '300M',
      error_file: '/root/.pm2/logs/9001app2-backend-error.log',
      out_file: '/root/.pm2/logs/9001app2-backend-out.log',
      time: true,
    },
  ],
};

module.exports = {
  apps: [{
    name: '9001app2-backend',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000
    }
  }]
}
