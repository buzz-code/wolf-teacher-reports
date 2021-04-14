module.exports = {
  apps: [
    {
      name: 'att-manager',
      script: './index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
