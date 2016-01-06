var horizontal = require('./horizontal')
var vertical = require('./vertical')
module.exports = function (el, full) {
  if (full) {
    return vertical(el).value * horizontal(el).value === 1
  } else {
    return vertical(el).value * horizontal(el).value > 0
  }
}
