const PACKAGE = require('./package.json');

module.exports = {
  apps: [
    {
      name: PACKAGE.name,
      script: './index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
