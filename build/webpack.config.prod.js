const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
const config = require('../config')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    publicPath: '',
    path: config.build.distPath
  },
  devtool: 'none'
})

module.exports = webpackConfig
