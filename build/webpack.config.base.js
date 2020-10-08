const glob = require('glob')
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config')

const getEntry = () => {
  const files = glob.sync(config.SRC + '/*.js')
  var entry = {}
  for (var i = 0; i < files.length; i++) {
    const name = files[i].replace(config.SRC + '/', '').replace('.js', '')
    entry[name] = files[i]
  }
  return entry
}
const entry = getEntry()

module.exports = {
  entry: entry,
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': config.SRC
    }
  },
  performance: {
    hints: false // 'warning'
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.vue$/i,
        exclude: config.NODE_MODULES,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx?$/i,
        exclude: config.NODE_MODULES,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        exclude: config.NODE_MODULES,
        use: [
          'vue-style-loader',
          { loader: 'css-loader', options: { sourceMap: config.IS_DEV, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: config.IS_DEV } }
        ]
      },
      {
        test: /\.scss$/i,
        exclude: config.NODE_MODULES,
        use: [
          'vue-style-loader',
          { loader: 'css-loader', options: { sourceMap: config.IS_DEV, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: config.IS_DEV } },
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/i,
        exclude: config.NODE_MODULES,
        use: [
          'vue-style-loader',
          { loader: 'css-loader', options: { sourceMap: config.IS_DEV, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: config.IS_DEV } },
          { loader: 'sass-loader', options: { indentedSyntax: true } }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // include: SRC_IMG,
        use: [
          {
            loader: 'url-loader', // 'file-loader',
            options: {
              limit: 10000, // Convert images < 10KB to base64 strings with url-loader
              name: '[name].[ext]?[hash:7]',
              outputPath: 'img/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                // optimizationLevel: 7,
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              svgo: {
                plugins: [
                  {
                    removeViewBox: false
                  },
                  {
                    removeEmptyAttrs: false
                  }
                ]
              }
              // the webp option will enable WEBP
              // webp: {
              //   quality: 75
              // }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // Convert images < 10KB to base64 strings with url-loader
          name: '[name].[ext]?[hash:7]',
          outputPath: 'media/'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // Convert images < 10KB to base64 strings with url-loader
          name: '[name].[ext]?[hash:7]',
          outputPath: 'fonts/'
        }
      }
    ]
  },

  plugins: Object.keys(entry).map(function (id) {
    return new HtmlWebpackPlugin({
      chunks: [id],
      filename: id + '.html',
      templateParameters: {
        id: id
      },
      template: config.SRC + '/template.html',
      inject: 'body',
      title: 'TESTING ' + entry[id]
    })
  }).concat([
    new VueLoaderPlugin()
  ])

}
