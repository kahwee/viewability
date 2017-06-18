/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (el) {
  var windowWidth = window.innerWidth;
  var elemLeft = el.getBoundingClientRect().left;
  var elemRight = el.getBoundingClientRect().right;
  var elemWidth = elemRight - elemLeft;
  if (elemLeft > windowWidth) {
    // Not viewable, below viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_RIGHT'
    };
  } else if (elemRight <= 0) {
    // Not viewable, above the viewport
    return {
      value: 0,
      state: 'EL_IS_TOO_LEFT'
    };
  } else if (elemLeft >= 0 && elemRight <= windowWidth) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_HORIZONTAL_VIEW'
    };
  } else if (elemLeft < 0 && elemRight > windowWidth) {
    // Top and bottom of element truncated
    return {
      value: windowWidth / elemWidth,
      state: 'EL_LEFT_AND_RIGHT_TRUNCATED'
    };
  } else if (elemLeft < 0 && elemRight <= windowWidth) {
    // Top of element is truncated
    return {
      value: elemRight / elemWidth,
      state: 'EL_LEFT_TRUNCATED'
    };
  } else if (elemLeft >= 0 && elemRight > windowWidth) {
    // Bottom of element is trunctaed
    return {
      value: (windowWidth - elemLeft) / elemWidth,
      state: 'EL_RIGHT_TRUNCATED'
    };
  }
  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (el) {
  var windowHeight = window.innerHeight;
  var elemTop = el.getBoundingClientRect().top;
  var elemBottom = el.getBoundingClientRect().bottom;
  var elemHeight = elemBottom - elemTop;
  if (elemTop > windowHeight) {
    // Not viewable, below viewport
    return {
      value: 0,
      state: 'EL_IS_BELOW_VIEW'
    };
  } else if (elemBottom <= 0) {
    // Not viewable, above the viewport
    return {
      value: 0,
      state: 'EL_IS_ABOVE_VIEW'
    };
  } else if (elemTop >= 0 && elemBottom <= windowHeight) {
    // Element is completely visible
    return {
      value: 1,
      state: 'EL_IS_WITHIN_VERTICAL_VIEW'
    };
  } else if (elemTop < 0 && elemBottom > windowHeight) {
    // Top and bottom of element truncated
    return {
      value: windowHeight / elemHeight,
      state: 'EL_BOTTOM_AND_TOP_TRUNCATED'
    };
  } else if (elemTop < 0 && elemBottom <= windowHeight) {
    // Top of element is truncated
    return {
      value: elemBottom / elemHeight,
      state: 'EL_TOP_TRUNCATED'
    };
  } else if (elemTop >= 0 && elemBottom > windowHeight) {
    // Bottom of element is trunctaed
    return {
      value: (windowHeight - elemTop) / elemHeight,
      state: 'EL_BOTTOM_TRUNCATED'
    };
  }
  // Generic error
  return {
    value: 0,
    state: 'EL_IS_NOT_WITHIN_VIEW'
  };
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var horizontal = __webpack_require__(0);
var vertical = __webpack_require__(1);
module.exports = function (el, full) {
  if (full) {
    return vertical(el).value * horizontal(el).value === 1;
  } else {
    return vertical(el).value * horizontal(el).value > 0;
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  vertical: __webpack_require__(1),
  horizontal: __webpack_require__(0),
  isElementOnScreen: __webpack_require__(2)
};

/***/ })
/******/ ]);