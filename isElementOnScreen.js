const horizontal = require('./horizontal')
const vertical = require('./vertical')

/**
 * Checks if an element is on screen
 * @param {HTMLElement} el - The element to check
 * @param {boolean} [full=false] - If true, checks if element is fully visible; otherwise checks if any part is visible
 * @returns {boolean} True if element is on screen according to the criteria
 */
module.exports = function (el, full) {
  if (full) {
    return vertical(el).value * horizontal(el).value === 1
  } else {
    return vertical(el).value * horizontal(el).value > 0
  }
}
