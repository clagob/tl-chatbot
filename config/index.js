const path = require('path')

module.exports = {

  SRC: path.resolve(__dirname, '../src'),
  NODE_MODULES: path.resolve(__dirname, './node_modules'),
  ENV: process.env.NODE_ENV || 'development',
  IS_DEV: (process.env.NODE_ENV || 'development') === 'development',

  API: {
    telephone: '/api/telephone.php',
    lunar: '/api/lunar.php'
  },

  dev: {
    distPath: path.resolve(__dirname, '../test/dist')
  },

  build: {
    distPath: path.resolve(__dirname, '../web/dist')
  }

}
