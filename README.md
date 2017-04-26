# viewability

Browser package to check if the element is on screen without dependencies. Or you can call it visibility.

[![Build Status](https://travis-ci.org/kahwee/viewability.svg?branch=master)](https://travis-ci.org/kahwee/viewability)
[![Coverage Status](https://coveralls.io/repos/github/kahwee/viewability/badge.svg?branch=master)](https://coveralls.io/github/kahwee/viewability?branch=master)
[![npm version](https://badge.fury.io/js/viewability.svg)](https://www.npmjs.com/package/viewability)
[![Bower version](https://badge.fury.io/bo/viewability.svg)](http://badge.fury.io/bo/viewability)
[![devDependency Status](https://david-dm.org/kahwee/viewability/dev-status.svg)](https://david-dm.org/kahwee/viewability#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![bitHound Score](https://www.bithound.io/github/kahwee/viewability/badges/score.svg)](https://www.bithound.io/github/kahwee/viewability)

No dependencies.

```js
var vertical = require('viewability/vertical');
vertical(document.getElementById('blue-box'));
// return {value: 1, state: "EL_IS_WITHIN_VERTICAL_VIEW"}
```

Use `'viewability/horizontal'` for corresponding view.

# Demo

Both source code are in the `gh-pages` branch.

[Draggable-based example](https://kahwee.github.io/viewability/)
[Timer-based example](https://kahwee.github.io/viewability/timer.html)

# Installation

* [Bower](http://bower.io/): `bower install --save viewability`
* [npm](https://www.npmjs.org/): `npm install --save viewability`
* Direct download the latest version: https://github.com/kahwee/viewability/releases
* [jsDelivr CDN](http://www.jsdelivr.com/#!viewability): `<script src="//cdn.jsdelivr.net/viewability/VERSION/viewability.min.js"></script>`

# Usage

## `viewability` package through CDN:

Loading it directly to the browser with `viewability` exposed to the window:

```html
<script src="//cdn.jsdelivr.net/viewability/latest/viewability.min.js"></script>
<script>
  var v = viewability.vertical(document.getElementById('red-box'));
  console.log(v);
  // return {value: 0.83, state: "EL_IS_WITHIN_VERTICAL_VIEW"}
</script>
```

## Using Common JS:

Finding out if the element is 100% on screen and using Common JS:

```js
var v = require('viewability');
var el = document.getElementById('blue-box');
if (v.isElementOnScreen(el, true)) {
  console.log('100% on screen.');
} else if (v.isElementOnScreen(el)) {
  console.log('Some parts are on screen');
} else {
  console.log('not on screen at all');
}
```

Use only vertical:

```
var vertical = require('viewability/vertical');
vertical(document.getElementById('blue-box'));
// return {value: 1, state: "EL_IS_WITHIN_VERTICAL_VIEW"}
```

Use only vertical with offset:

```
var vertical = require('viewability/vertical');
var config = { offsetTop: 25, offsetBottom: 25 }
vertical(document.getElementById('blue-box'), config);
// return {value: .5, state: "EL_BOTTOM_AND_TOP_TRUNCATED"}
```

Use only horizontal:

```
var horizontal = require('viewability/horizontal');
horizontal(document.getElementById('blue-box'));
// return {value: 1, state: "EL_IS_WITHIN_HORIZONTAL_VIEW"}
```

Use only horizontal with offset:

```
var horizontal = require('viewability/horizontal');
var config = { offsetLeft: 25, offsetRight: 25 };
horizontal(document.getElementById('blue-box'), config);
// return {value: .5, state: "EL_LEFT_AND_RIGHT_TRUNCATED"}
```

# Running tests

While `viewability` has no dependencies, testing uses Karma.

```sh
npm install
npm test
```

# License

ISC
