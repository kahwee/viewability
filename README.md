# viewability

browser package to check if the element is on screen.

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

# License

ISC.
