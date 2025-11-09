/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./horizontal.js":
/*!***********************!*\
  !*** ./horizontal.js ***!
  \***********************/
/***/ ((module) => {

eval("{/**\n * @typedef {Object} ViewabilityResult\n * @property {number} value - A number between 0 and 1 representing the viewability percentage\n * @property {string} state - The state of the element's viewability\n */\n\n/**\n * Calculates the horizontal viewability of an element\n * @param {HTMLElement} el - The element to check\n * @returns {ViewabilityResult} Object containing the viewability value and state\n */\nmodule.exports = function (el) {\n  var windowWidth = window.innerWidth;\n  var elemLeft = el.getBoundingClientRect().left;\n  var elemRight = el.getBoundingClientRect().right;\n  var elemWidth = elemRight - elemLeft;\n  if (elemLeft > windowWidth) {\n    // Not viewable, to the right of viewport\n    return {\n      value: 0,\n      state: 'EL_IS_TOO_RIGHT'\n    };\n  } else if (elemRight <= 0) {\n    // Not viewable, to the left of viewport\n    return {\n      value: 0,\n      state: 'EL_IS_TOO_LEFT'\n    };\n  } else if (elemLeft >= 0 && elemRight <= windowWidth) {\n    // Element is completely visible\n    return {\n      value: 1,\n      state: 'EL_IS_WITHIN_HORIZONTAL_VIEW'\n    };\n  } else if (elemLeft < 0 && elemRight > windowWidth) {\n    // Left and right of element truncated\n    return {\n      value: windowWidth / elemWidth,\n      state: 'EL_LEFT_AND_RIGHT_TRUNCATED'\n    };\n  } else if (elemLeft < 0 && elemRight <= windowWidth) {\n    // Left of element is truncated\n    return {\n      value: elemRight / elemWidth,\n      state: 'EL_LEFT_TRUNCATED'\n    };\n  } else if (elemLeft >= 0 && elemRight > windowWidth) {\n    // Right of element is truncated\n    return {\n      value: (windowWidth - elemLeft) / elemWidth,\n      state: 'EL_RIGHT_TRUNCATED'\n    };\n  }\n\n  // Generic error\n  return {\n    value: 0,\n    state: 'EL_IS_NOT_WITHIN_VIEW'\n  };\n};\n\n//# sourceURL=webpack://viewability/./horizontal.js?\n}");

/***/ }),

/***/ "./isElementOnScreen.js":
/*!******************************!*\
  !*** ./isElementOnScreen.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("{var horizontal = __webpack_require__(/*! ./horizontal */ \"./horizontal.js\");\nvar vertical = __webpack_require__(/*! ./vertical */ \"./vertical.js\");\n\n/**\n * Checks if an element is on screen\n * @param {HTMLElement} el - The element to check\n * @param {boolean} [full=false] - If true, checks if element is fully visible; otherwise checks if any part is visible\n * @returns {boolean} True if element is on screen according to the criteria\n */\nmodule.exports = function (el, full) {\n  if (full) {\n    return vertical(el).value * horizontal(el).value === 1;\n  } else {\n    return vertical(el).value * horizontal(el).value > 0;\n  }\n};\n\n//# sourceURL=webpack://viewability/./isElementOnScreen.js?\n}");

/***/ }),

/***/ "./vertical.js":
/*!*********************!*\
  !*** ./vertical.js ***!
  \*********************/
/***/ ((module) => {

eval("{/**\n * @typedef {Object} ViewabilityResult\n * @property {number} value - A number between 0 and 1 representing the viewability percentage\n * @property {string} state - The state of the element's viewability\n */\n\n/**\n * Calculates the vertical viewability of an element\n * @param {HTMLElement} el - The element to check\n * @returns {ViewabilityResult} Object containing the viewability value and state\n */\nmodule.exports = function (el) {\n  var windowHeight = window.innerHeight;\n  var elemTop = el.getBoundingClientRect().top;\n  var elemBottom = el.getBoundingClientRect().bottom;\n  var elemHeight = elemBottom - elemTop;\n  if (elemTop > windowHeight) {\n    // Not viewable, below viewport\n    return {\n      value: 0,\n      state: 'EL_IS_BELOW_VIEW'\n    };\n  } else if (elemBottom <= 0) {\n    // Not viewable, above the viewport\n    return {\n      value: 0,\n      state: 'EL_IS_ABOVE_VIEW'\n    };\n  } else if (elemTop >= 0 && elemBottom <= windowHeight) {\n    // Element is completely visible\n    return {\n      value: 1,\n      state: 'EL_IS_WITHIN_VERTICAL_VIEW'\n    };\n  } else if (elemTop < 0 && elemBottom > windowHeight) {\n    // Top and bottom of element truncated\n    return {\n      value: windowHeight / elemHeight,\n      state: 'EL_BOTTOM_AND_TOP_TRUNCATED'\n    };\n  } else if (elemTop < 0 && elemBottom <= windowHeight) {\n    // Top of element is truncated\n    return {\n      value: elemBottom / elemHeight,\n      state: 'EL_TOP_TRUNCATED'\n    };\n  } else if (elemTop >= 0 && elemBottom > windowHeight) {\n    // Bottom of element is truncated\n    return {\n      value: (windowHeight - elemTop) / elemHeight,\n      state: 'EL_BOTTOM_TRUNCATED'\n    };\n  }\n\n  // Generic error\n  return {\n    value: 0,\n    state: 'EL_IS_NOT_WITHIN_VIEW'\n  };\n};\n\n//# sourceURL=webpack://viewability/./vertical.js?\n}");

/***/ }),

/***/ "./viewability.js":
/*!************************!*\
  !*** ./viewability.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("{/**\n * @module viewability\n * @description Returns how viewable an element is on screen\n */\n\nmodule.exports = {\n  vertical: __webpack_require__(/*! ./vertical */ \"./vertical.js\"),\n  horizontal: __webpack_require__(/*! ./horizontal */ \"./horizontal.js\"),\n  isElementOnScreen: __webpack_require__(/*! ./isElementOnScreen */ \"./isElementOnScreen.js\")\n};\n\n//# sourceURL=webpack://viewability/./viewability.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./viewability.js");
/******/ 	
/******/ })()
;