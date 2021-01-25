module.exports = {
  apps: [
    {
      name: 'listen-report',
      script: './server/app.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
