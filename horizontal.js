/**
  A method for calculating the percentage of an element inside of a given horizontal region of the viewport
  @param {element} el Element from the DOM
  @param {object} config Object containing specifications for the viewability appraisal
  @param {number} config.offsetRight Number of pixels to offset on the righthand side of the viewport
  @param {number} config.offsetLeft Number of pixels to offset on the lefthand side of the viewport
  @return {object} Object containing a `value` property, denoting the percent of the element inside of the active viewport, and a `state` property consisting of string, denoting the element's in-view status
 */

module.exports = function (el, config = {}) {
  
    // Get the cropped righthand boundary
  const windowWidth = window.innerWidth;
  const offsetRight = config.offsetRight || 0;
  const rightBound = windowWidth - offsetRight;

  // Get the cropped lefthand boundary:
  const leftBound = config.offsetLeft || 0;

  // Get the cropped viewport size, to later evaluate percent of element in view
  const activeViewportWidth = rightBound - leftBound;

  // Get element specs:
  const elemRect = el.getBoundingClientRect();
  const elemLeft = elemRect.left;
  const elemRight = elemRect.right;
  const elemWidth = elemRight - elemLeft;
  
  // Evaluate element's position in the cropped viewport:
  if (elemLeft > rightBound) {
    // Not viewable, to right of viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_RIGHT'
    }
  } else if (elemRight <= leftBound) {
    // Not viewable, to left of viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_LEFT'
    }
  } else if (elemLeft >= leftBound && elemRight <= rightBound) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_HORIZONTAL_VIEW'
    }
  } else if (elemLeft < leftBound && elemRight > rightBound) {
    // Left and right of element truncated
    return {
      value: activeViewportWidth / elemWidth,
      state: 'EL_LEFT_AND_RIGHT_TRUNCATED'
    }
  } else if (elemLeft < leftBound && elemRight <= rightBound) {
    // Left of element is truncated
    return {
      value: (elemRight - leftBound) / elemWidth,
      state: 'EL_LEFT_TRUNCATED'
    }
  } else if (elemLeft >= leftBound && elemRight > rightBound) {
    // Right of element is trunctaed
    return {
      value: (activeViewportWidth - elemLeft) / elemWidth,
      state: 'EL_RIGHT_TRUNCATED'
    }
  }
  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  }
}
