const path = require('path')

module.exports = {

  SRC: path.resolve(__dirname, '../src'),
  NODE_MODULES: path.resolve(__dirname, './node_modules'),
  ENV: process.env.NODE_ENV || 'development',
  IS_DEV: (process.env.NODE_ENV || 'development') === 'development',

  dev: {
    distPath: path.resolve(__dirname, '../test/dist'),
    api: {
      telephone: '/api/telephone.php',
      lunar: '/api/lunar.php'
    },
    server: {
      proxy: {
        '/api': 'http://localhost:9000'
      }
    }
  },

  build: {
    distPath: path.resolve(__dirname, '../web/dist'),
    api: {
      telephone: '/api/telephone.php',
      lunar: '/api/lunar.php'
    }
  }

}
