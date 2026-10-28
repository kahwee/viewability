# API and usage

## Example

```ts
import { isElementOnScreen, measure } from 'viewability'

const element = document.querySelector('#target')

if (element) {
  const result = measure(element)

  console.log(result.value) // visible area from 0 to 1
  console.log(result.visible) // any area is visible
  console.log(result.fullyVisible) // the entire element is visible
  console.log(result.vertical) // vertical percentage and position state
  console.log(result.horizontal) // horizontal percentage and position state

  isElementOnScreen(element) // any visible area
  isElementOnScreen(element, true) // fully visible
}
```

Focused imports are available from `viewability/vertical`, `viewability/horizontal`, `viewability/isElementOnScreen`, and `viewability/measure`.

CommonJS remains supported:

```js
const { measure } = require('viewability')
const vertical = require('viewability/vertical')
```

The package ships ESM, CommonJS, TypeScript declarations, focused subpath exports, and `dist/viewability.min.js` for script tags. The browser build exposes a global `viewability` object.

## API

- `measure(element)` returns the combined visible-area ratio and both axis results.
- `vertical(element)` returns `{ value, state }` for vertical visibility.
- `horizontal(element)` returns `{ value, state }` for horizontal visibility.
- `isElementOnScreen(element, full?)` returns a visibility boolean.

Each call reads `getBoundingClientRect()` once. Use `IntersectionObserver` instead when continuously observing many elements.

For example, an element with half its width and all its height in the viewport
has a visible-area ratio of `0.5`. Use that ratio for a geometry threshold:

```js
import { measure } from 'viewability'

const card = document.querySelector('.card')
if (card && measure(card).value >= 0.5) {
  console.log('At least half of the card is inside the viewport')
}
```

Measurements describe the bounding rectangle's overlap with the viewport. They
do not establish whether another element covers it, a parent clips it, opacity
hides it, or a person actually saw it. Call these APIs in a browser after the
element has been mounted.
