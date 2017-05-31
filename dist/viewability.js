(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.viewability = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
  A method for calculating the percentage of an element inside of a given horizontal region of the viewport
  @param {element} el Element from the DOM
  @param {object} config Object containing specifications for the viewability appraisal
  @param {number} config.offsetRight Number of pixels to offset on the righthand side of the viewport
  @param {number} config.offsetLeft Number of pixels to offset on the lefthand side of the viewport
  @return {object} Object containing a `value` property, denoting the percent of the element inside of the active viewport, and a `state` property consisting of string, denoting the element's in-view status
 */

module.exports = function (el) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  // Get the cropped righthand boundary
  var windowWidth = window.innerWidth;
  var offsetRight = config.offsetRight || 0;
  var rightBound = windowWidth - offsetRight;

  // Get the cropped lefthand boundary:
  var leftBound = config.offsetLeft || 0;

  // Get the cropped viewport size, to later evaluate percent of element in view
  var activeViewportWidth = rightBound - leftBound;

  // Get element specs:
  var elemRect = el.getBoundingClientRect();
  var elemLeft = elemRect.left;
  var elemRight = elemRect.right;
  var elemWidth = elemRight - elemLeft;

  // Evaluate element's position in the cropped viewport:
  if (elemLeft > rightBound) {
    // Not viewable, to right of viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_RIGHT'
    };
  } else if (elemRight <= leftBound) {
    // Not viewable, to left of viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_LEFT'
    };
  } else if (elemLeft >= leftBound && elemRight <= rightBound) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_HORIZONTAL_VIEW'
    };
  } else if (elemLeft < leftBound && elemRight > rightBound) {
    // Left and right of element truncated
    return {
      value: activeViewportWidth / elemWidth,
      state: 'EL_LEFT_AND_RIGHT_TRUNCATED'
    };
  } else if (elemLeft < leftBound && elemRight <= rightBound) {
    // Left of element is truncated
    return {
      value: (elemRight - leftBound) / elemWidth,
      state: 'EL_LEFT_TRUNCATED'
    };
  } else if (elemLeft >= leftBound && elemRight > rightBound) {
    // Right of element is trunctaed
    return {
      value: (activeViewportWidth - elemLeft) / elemWidth,
      state: 'EL_RIGHT_TRUNCATED'
    };
  }
  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  };
};

},{}],2:[function(require,module,exports){
'use strict';

var horizontal = require('./horizontal');
var vertical = require('./vertical');
module.exports = function (el, full) {
  if (full) {
    return vertical(el).value * horizontal(el).value === 1;
  } else {
    return vertical(el).value * horizontal(el).value > 0;
  }
};

},{"./horizontal":1,"./vertical":3}],3:[function(require,module,exports){
'use strict';

/**
  A method for calculating the percentage of an element inside of a given vertical region of the viewport
  @param {element} el Element from the DOM
  @param {object} config Object containing specifications for the viewability appraisal
  @param {number} config.offsetTop Number of pixels to offset on the top side of the viewport
  @param {number} config.offsetBottom Number of pixels to offset on the bottom of the viewport
  @return {object} Object containing a `value` property, denoting the percent of the element inside of the active viewport, and a `state` property consisting of string, denoting the element's in-view status
 */

module.exports = function (el) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  // Get the cropped bottom boundary
  var windowHeight = window.innerHeight;
  var offsetBottom = config.offsetBottom || 0;
  var bottomBound = windowHeight - offsetBottom;

  // Get the cropped top boundary:
  var topBound = config.offsetTop || 0;

  // Get the cropped viewport size, to later evaluate percent of element in view
  var activeViewportHeight = bottomBound - topBound;

  // Get element specs:
  var elemRect = el.getBoundingClientRect();
  var elemTop = elemRect.top;
  var elemBottom = elemRect.bottom;
  var elemHeight = elemBottom - elemTop;

  // Evaluate element's position in the cropped viewport:
  if (elemTop > bottomBound) {
    // Not viewable, below viewport
    return {
      value: 0,
      state: 'EL_IS_BELOW_VIEW'
    };
  } else if (elemBottom <= topBound) {
    // Not viewable, above the viewport
    return {
      value: 0,
      state: 'EL_IS_ABOVE_VIEW'
    };
  } else if (elemTop >= topBound && elemBottom <= bottomBound) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_VERTICAL_VIEW'
    };
  } else if (elemTop < topBound && elemBottom > bottomBound) {
    // Top and bottom of element truncated
    return {
      value: activeViewportHeight / elemHeight,
      state: 'EL_BOTTOM_AND_TOP_TRUNCATED'
    };
  } else if (elemTop < topBound && elemBottom <= bottomBound) {
    // Top of element is truncated
    return {
      value: (elemBottom - topBound) / elemHeight,
      state: 'EL_TOP_TRUNCATED'
    };
  } else if (elemTop >= topBound && elemBottom > bottomBound) {
    // Bottom of element is trunctaed
    return {
      value: (activeViewportHeight - elemTop) / elemHeight,
      state: 'EL_BOTTOM_TRUNCATED'
    };
  }
  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  };
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
  vertical: require('./vertical'),
  horizontal: require('./horizontal'),
  isElementOnScreen: require('./isElementOnScreen')
};

},{"./horizontal":1,"./isElementOnScreen":2,"./vertical":3}]},{},[4])(4)
});