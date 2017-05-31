/**
  A method for calculating the percentage of an element inside of a given vertical region of the viewport
  @param {element} el Element from the DOM
  @param {object} config Object containing specifications for the viewability appraisal
  @param {number} config.offsetTop Number of pixels to offset on the top side of the viewport
  @param {number} config.offsetBottom Number of pixels to offset on the bottom of the viewport
  @return {object} Object containing a `value` property, denoting the percent of the element inside of the active viewport, and a `state` property consisting of string, denoting the element's in-view status
 */

module.exports = function (el, config = {}) {

    // Get the cropped bottom boundary
  const windowHeight = window.innerHeight;
  const offsetBottom = config.offsetBottom || 0;
  const bottomBound = windowHeight - offsetBottom;

  // Get the cropped top boundary:
  const topBound = config.offsetTop || 0;

  // Get the cropped viewport size, to later evaluate percent of element in view
  const activeViewportHeight = bottomBound - topBound;

  // Get element specs:
  const elemRect = el.getBoundingClientRect();
  const elemTop = elemRect.top;
  const elemBottom = elemRect.bottom;
  const elemHeight = elemBottom - elemTop;

  // Evaluate element's position in the cropped viewport:
  if (elemTop > bottomBound) {
    // Not viewable, below viewport
    return {
      value: 0,
      state: 'EL_IS_BELOW_VIEW'
    }
  } else if (elemBottom <= topBound) {
    // Not viewable, above the viewport
    return {
      value: 0,
      state: 'EL_IS_ABOVE_VIEW'
    }
  } else if (elemTop >= topBound && elemBottom <= bottomBound) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_VERTICAL_VIEW'
    }
  } else if (elemTop < topBound && elemBottom > bottomBound) {
    // Top and bottom of element truncated
    return {
      value: activeViewportHeight / elemHeight,
      state: 'EL_BOTTOM_AND_TOP_TRUNCATED'
    }
  } else if (elemTop < topBound && elemBottom <= bottomBound) {
    // Top of element is truncated
    return {
      value: (elemBottom - topBound) / elemHeight,
      state: 'EL_TOP_TRUNCATED'
    }
  } else if (elemTop >= topBound && elemBottom > bottomBound) {
    // Bottom of element is trunctaed
    return {
      value: (activeViewportHeight - elemTop) / elemHeight,
      state: 'EL_BOTTOM_TRUNCATED'
    }
  }
  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  }
}
