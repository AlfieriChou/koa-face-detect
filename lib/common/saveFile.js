const fs = require('fs')
const path = require('path')

const baseDir = path.resolve(__dirname, '../out')

module.exports = (fileName, buf) => {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }
  fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}
