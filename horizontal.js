/**
 * @typedef {Object} ViewabilityResult
 * @property {number} value - A number between 0 and 1 representing the viewability percentage
 * @property {string} state - The state of the element's viewability
 */

/**
 * Calculates the horizontal viewability of an element
 * @param {HTMLElement} el - The element to check
 * @returns {ViewabilityResult} Object containing the viewability value and state
 */
module.exports = function (el) {
  const windowWidth = window.innerWidth
  const elemLeft = el.getBoundingClientRect().left
  const elemRight = el.getBoundingClientRect().right
  const elemWidth = elemRight - elemLeft

  if (elemLeft > windowWidth) {
    // Not viewable, to the right of viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_RIGHT'
    }
  } else if (elemRight <= 0) {
    // Not viewable, to the left of viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_LEFT'
    }
  } else if (elemLeft >= 0 && elemRight <= windowWidth) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_HORIZONTAL_VIEW'
    }
  } else if (elemLeft < 0 && elemRight > windowWidth) {
    // Left and right of element truncated
    return {
      value: windowWidth / elemWidth,
      state: 'EL_LEFT_AND_RIGHT_TRUNCATED'
    }
  } else if (elemLeft < 0 && elemRight <= windowWidth) {
    // Left of element is truncated
    return {
      value: elemRight / elemWidth,
      state: 'EL_LEFT_TRUNCATED'
    }
  } else if (elemLeft >= 0 && elemRight > windowWidth) {
    // Right of element is truncated
    return {
      value: (windowWidth - elemLeft) / elemWidth,
      state: 'EL_RIGHT_TRUNCATED'
    }
  }

  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  }
}
