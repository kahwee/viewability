# viewability

A small, zero-runtime-dependency library for synchronously measuring how much of an element intersects the browser viewport.

## Install

```sh
npm install viewability
```

The package includes ESM, CommonJS, TypeScript declarations, and a minified browser bundle.

## Usage

```ts
import { horizontal, isElementOnScreen, measure, vertical } from 'viewability'

const element = document.querySelector('#example')!

vertical(element)
// { value: 1, state: 'EL_IS_WITHIN_VERTICAL_VIEW' }

horizontal(element)
// { value: 0.5, state: 'EL_RIGHT_TRUNCATED' }

measure(element)
// { value: 0.5, visible: true, fullyVisible: false, vertical: ..., horizontal: ... }

isElementOnScreen(element) // any visible area
isElementOnScreen(element, true) // fully visible on both axes
```

CommonJS and focused subpath imports remain supported:

```js
const viewability = require('viewability')
const vertical = require('viewability/vertical')
const horizontal = require('viewability/horizontal')
const isElementOnScreen = require('viewability/isElementOnScreen')
```

For a script tag, use `dist/viewability.min.js` from the npm package or a CDN. It exposes `viewability` globally.

## API

Every percentage is between `0` and `1`. A combined measurement multiplies the visible vertical and horizontal proportions, producing the visible area ratio.

### `vertical(element)`

Returns `{ value, state }` for the vertical axis. States describe whether the element is above, below, within, or truncated by the viewport.

### `horizontal(element)`

Returns `{ value, state }` for the horizontal axis. States describe whether the element is left, right, within, or truncated by the viewport.

### `measure(element)`

Reads the element rectangle once and returns the combined visible area plus both axis results.

### `isElementOnScreen(element, full = false)`

Returns `true` when any area is visible. Pass `true` to require complete visibility.

## Choosing this library or `IntersectionObserver`

Use `viewability` when you need an immediate synchronous answer, exact visible-area ratios, or the positional state. Use `IntersectionObserver` for continuous observation of many elements; it avoids repeatedly measuring layout in scroll handlers.

## Development

Requires Node.js 20 or newer.

```sh
npm install
npm run check
```

`npm run check` performs strict typechecking, unit tests, 100% coverage checks, production builds, and installed-package compatibility tests for ESM, CommonJS, subpath imports, and the browser bundle.

See [CONTRIBUTING.md](CONTRIBUTING.md) for project conventions.

## License

ISC
