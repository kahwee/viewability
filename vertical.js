module.exports = function (el) {
  var windowHeight = window.innerHeight
  var elemTop = el.getBoundingClientRect().top
  var elemBottom = el.getBoundingClientRect().bottom
  var elemHeight = elemBottom - elemTop
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
    // Bottom of element is trunctaed
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
