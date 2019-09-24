const rm = require('rimraf')
// const path = require('path')
const config = require('../config')

rm(config.build.distPath + '/**', err => {
  if (err) throw err
  console.log('Clean all the build compiled code!')
})

rm(config.dev.distPath + '/**', err => {
  if (err) throw err
  console.log('Clean all the dev compiled code!')
})
