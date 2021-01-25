module.exports = {
  apps: [
    {
      name: 'listen-report',
      script: './index.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
