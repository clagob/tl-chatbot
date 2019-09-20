const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
const path = require('path')
const config = require('../config')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  // https://webpack.js.org/configuration/devtool/#development
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    open: true,
    stats: {
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    },
    contentBase: path.join(__dirname, '../test'),
    watchOptions: {
      poll: true
    },
    proxy: config.dev.server.proxy
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = webpackConfig
