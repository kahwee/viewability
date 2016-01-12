(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.viewability = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var horizontal = require('./horizontal')
var vertical = require('./vertical')
module.exports = function (el, full) {
  if (full) {
    return vertical(el).value * horizontal(el).value === 1
  } else {
    return vertical(el).value * horizontal(el).value > 0
  }
}

},{"./horizontal":1,"./vertical":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = {
  vertical: require('./vertical'),
  horizontal: require('./horizontal'),
  isElementOnScreen: require('./isElementOnScreen')
}

},{"./horizontal":1,"./isElementOnScreen":2,"./vertical":3}]},{},[4])(4)
});