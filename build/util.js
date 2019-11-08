const path = require('path')

exports.resolve = function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

exports.staticPath = function resolve(dir) {
  return path.join('static/', dir)
}

