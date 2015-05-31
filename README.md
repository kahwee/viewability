# viewability

browser package to check if the element is on screen. Or you can call it visibility.

[![npm version](https://badge.fury.io/js/viewability.svg)](https://www.npmjs.com/package/viewability) [![Bower version](https://badge.fury.io/bo/viewability.svg)](http://badge.fury.io/bo/viewability) 

```js
var vertical = require('viewability/vertical');
vertical(document.getElementById('blue-box'));
// return {value: 1, state: "EL_IS_WITHIN_VERTICAL_VIEW"}
```

Use `'viewability/horizontal'` for corresponding view.

# Installation

From `npm`:

```sh
npm install --save viewability
```

From `bower`:

```sh
bower install --save viewability
```

# I want to find out if element is 100% on screen

```js
var v = require('viewability');
var el = document.getElementById('blue-box');
if (v.horizontal(el).value === 0 && v.vertical(el).value === 0) {
  console.log('100% on screen.')
} else if (v.horizontal(el).value > 0 || v.value(el).value > 0) {
  console.log('Part of element in on screen.')
}
```

# Running tests

While `viewability` has no dependencies, testing uses Karma and jQuery.

```sh
npm install
npm test
```

# License

ISC
