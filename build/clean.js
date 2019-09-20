const rm = require('rimraf')
const path = require('path')

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  console.log('Clean all the compiled code!')
})
