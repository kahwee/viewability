module.exports = function (el) {
  var windowWidth = window.innerWidth
  var elemLeft = el.getBoundingClientRect().left
  var elemRight = el.getBoundingClientRect().right
  var elemWidth = elemRight - elemLeft
  if (elemLeft > windowWidth) {
    // Not viewable, below viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_RIGHT'
    }
  } else if (elemRight <= 0) {
    // Not viewable, above the viewport
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
    // Top and bottom of element truncated
    return {
      value: windowWidth / elemWidth,
      state: 'EL_LEFT_AND_RIGHT_TRUNCATED'
    }
  } else if (elemLeft < 0 && elemRight <= windowWidth) {
    // Top of element is truncated
    return {
      value: elemRight / elemWidth,
      state: 'EL_LEFT_TRUNCATED'
    }
  } else if (elemLeft >= 0 && elemRight > windowWidth) {
    // Bottom of element is trunctaed
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
