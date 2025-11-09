/**
 * @typedef {Object} ViewabilityResult
 * @property {number} value - A number between 0 and 1 representing the viewability percentage
 * @property {string} state - The state of the element's viewability
 */

/**
 * Calculates the vertical viewability of an element
 * @param {HTMLElement} el - The element to check
 * @returns {ViewabilityResult} Object containing the viewability value and state
 */
module.exports = function (el) {
  const windowHeight = window.innerHeight
  const elemTop = el.getBoundingClientRect().top
  const elemBottom = el.getBoundingClientRect().bottom
  const elemHeight = elemBottom - elemTop

  if (elemTop > windowHeight) {
    // Not viewable, below viewport
    return {
      value: 0,
      state: 'EL_IS_BELOW_VIEW'
    }
  } else if (elemBottom <= 0) {
    // Not viewable, above the viewport
    return {
      value: 0,
      state: 'EL_IS_ABOVE_VIEW'
    }
  } else if (elemTop >= 0 && elemBottom <= windowHeight) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_VERTICAL_VIEW'
    }
  } else if (elemTop < 0 && elemBottom > windowHeight) {
    // Top and bottom of element truncated
    return {
      value: windowHeight / elemHeight,
      state: 'EL_BOTTOM_AND_TOP_TRUNCATED'
    }
  } else if (elemTop < 0 && elemBottom <= windowHeight) {
    // Top of element is truncated
    return {
      value: elemBottom / elemHeight,
      state: 'EL_TOP_TRUNCATED'
    }
  } else if (elemTop >= 0 && elemBottom > windowHeight) {
    // Bottom of element is truncated
    return {
      value: (windowHeight - elemTop) / elemHeight,
      state: 'EL_BOTTOM_TRUNCATED'
    }
  }

  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  }
}
