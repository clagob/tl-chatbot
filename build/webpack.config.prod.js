const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
// const config = require('../config')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production'
})

module.exports = webpackConfig
