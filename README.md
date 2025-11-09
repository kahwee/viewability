# viewability

A lightweight, zero-dependency JavaScript library for measuring element visibility in the browser viewport. Perfect for ad viewability tracking, lazy loading, scroll animations, and analytics.

[![Build Status](https://travis-ci.org/kahwee/viewability.svg?branch=master)](https://travis-ci.org/kahwee/viewability)
[![Coverage Status](https://coveralls.io/repos/github/kahwee/viewability/badge.svg?branch=master)](https://coveralls.io/github/kahwee/viewability?branch=master)
[![npm version](https://badge.fury.io/js/viewability.svg)](https://www.npmjs.com/package/viewability)
[![Greenkeeper badge](https://badges.greenkeeper.io/kahwee/viewability.svg)](https://greenkeeper.io/)
[![devDependency Status](https://david-dm.org/kahwee/viewability/dev-status.svg)](https://david-dm.org/kahwee/viewability#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Features

- **Zero dependencies** - Lightweight and fast
- **Precise measurements** - Returns exact percentage (0-1) of element visibility
- **Flexible API** - Check vertical, horizontal, or combined visibility
- **Detailed state information** - Know exactly why an element is not visible
- **CommonJS & CDN support** - Use with any build system or directly in the browser

## Quick Start

```js
var vertical = require("viewability/vertical");
var result = vertical(document.getElementById("blue-box"));
// Returns: {value: 1, state: "EL_IS_WITHIN_VERTICAL_VIEW"}
// value: 1 means 100% visible vertically
// value: 0.5 means 50% visible vertically
// value: 0 means not visible at all
```

## Demo

See live examples of viewability in action:

- [Draggable-based example](https://kahwee.github.io/viewability/) - Drag elements around to see real-time viewability
- [Timer-based example](https://kahwee.github.io/viewability/timer.html) - Automatic scrolling demonstration

Source code for demos is in the `gh-pages` branch.

## Installation

### npm

```bash
npm install --save viewability
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/viewability@latest/dist/viewability.min.js"></script>
```

Or specify a version:

```html
<script src="https://cdn.jsdelivr.net/npm/viewability@1.3.4/dist/viewability.min.js"></script>
```

### Direct Download

Download the latest version from [GitHub Releases](https://github.com/kahwee/viewability/releases)

## Usage

### Basic Usage (CommonJS)

Check if an element is visible on screen:

```js
var v = require("viewability");
var el = document.getElementById("blue-box");

// Check if any part is visible
if (v.isElementOnScreen(el)) {
  console.log("Element is at least partially visible");
}

// Check if element is 100% visible
if (v.isElementOnScreen(el, true)) {
  console.log("Element is completely visible");
}
```

### Vertical Viewability

Get detailed vertical visibility information:

```js
var vertical = require('viewability/vertical');
var result = vertical(document.getElementById('blue-box'));

console.log(result);
// {value: 1, state: "EL_IS_WITHIN_VERTICAL_VIEW"}
// value: 0-1 (percentage visible)
// state: describes position relative to viewport
```

**Possible vertical states:**
- `EL_IS_WITHIN_VERTICAL_VIEW` - Fully visible vertically
- `EL_IS_ABOVE_VIEW` - Element is above the viewport
- `EL_IS_BELOW_VIEW` - Element is below the viewport
- `EL_TOP_TRUNCATED` - Top portion is cut off
- `EL_BOTTOM_TRUNCATED` - Bottom portion is cut off
- `EL_BOTTOM_AND_TOP_TRUNCATED` - Both top and bottom are cut off
- `EL_IS_NOT_WITHIN_VIEW` - Generic not visible state

### Horizontal Viewability

Get detailed horizontal visibility information:

```js
var horizontal = require('viewability/horizontal');
var result = horizontal(document.getElementById('blue-box'));

console.log(result);
// {value: 1, state: "EL_IS_WITHIN_HORIZONTAL_VIEW"}
```

**Possible horizontal states:**
- `EL_IS_WITHIN_HORIZONTAL_VIEW` - Fully visible horizontally
- `EL_IS_TOO_LEFT` - Element is to the left of the viewport
- `EL_IS_TOO_RIGHT` - Element is to the right of the viewport
- `EL_LEFT_TRUNCATED` - Left portion is cut off
- `EL_RIGHT_TRUNCATED` - Right portion is cut off
- `EL_LEFT_AND_RIGHT_TRUNCATED` - Both left and right are cut off
- `EL_IS_NOT_WITHIN_VIEW` - Generic not visible state

### CDN Usage

When using the CDN, the library is exposed globally as `viewability`:

```html
<script src="https://cdn.jsdelivr.net/npm/viewability@latest/dist/viewability.min.js"></script>
<script>
  var element = document.getElementById('my-element');

  // Check vertical visibility
  var v = viewability.vertical(element);
  console.log('Vertical visibility:', v.value * 100 + '%');

  // Check horizontal visibility
  var h = viewability.horizontal(element);
  console.log('Horizontal visibility:', h.value * 100 + '%');

  // Quick boolean check
  if (viewability.isElementOnScreen(element)) {
    console.log('Element is visible!');
  }
</script>
```

## Use Cases

### Ad Viewability Tracking

Track when advertisements are actually viewable according to IAB standards:

```js
var vertical = require('viewability/vertical');
var horizontal = require('viewability/horizontal');

function trackAdViewability(adElement) {
  var v = vertical(adElement);
  var h = horizontal(adElement);
  var visiblePercentage = v.value * h.value;

  // IAB standard: 50% visible for 1 second
  if (visiblePercentage >= 0.5) {
    console.log('Ad is viewable:', (visiblePercentage * 100).toFixed(1) + '%');
  }
}
```

### Lazy Loading Images

Load images only when they're about to enter the viewport:

```js
var vertical = require('viewability/vertical');

function checkLazyLoad() {
  document.querySelectorAll('img[data-src]').forEach(function(img) {
    var v = vertical(img);
    // Start loading when element is close to viewport
    if (v.value > 0 || v.state === 'EL_IS_BELOW_VIEW') {
      var rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) { // 200px threshold
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      }
    }
  });
}

window.addEventListener('scroll', checkLazyLoad);
```

### Scroll-Based Animations

Trigger animations when elements become visible:

```js
var viewability = require('viewability');

function checkAnimations() {
  document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
    if (viewability.isElementOnScreen(el)) {
      el.classList.add('animated');
    }
  });
}

window.addEventListener('scroll', checkAnimations);
```

## API Reference

### `vertical(element)`

Returns vertical viewability information for an element.

- **Parameters:**
  - `element` (HTMLElement): The DOM element to check
- **Returns:** Object with:
  - `value` (number): Visibility percentage from 0 to 1
  - `state` (string): Description of element position

### `horizontal(element)`

Returns horizontal viewability information for an element.

- **Parameters:**
  - `element` (HTMLElement): The DOM element to check
- **Returns:** Object with:
  - `value` (number): Visibility percentage from 0 to 1
  - `state` (string): Description of element position

### `isElementOnScreen(element, [full])`

Boolean check for element visibility.

- **Parameters:**
  - `element` (HTMLElement): The DOM element to check
  - `full` (boolean, optional): If true, checks for 100% visibility. If false/omitted, checks for any visibility
- **Returns:** boolean

## Browser Compatibility

This library uses `getBoundingClientRect()` and `window.innerWidth`/`window.innerHeight`, which are supported in all modern browsers and IE9+.

## Development

### Running Tests

```bash
npm install
npm test
```

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
