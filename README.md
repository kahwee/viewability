# viewability

A zero-dependency browser library for synchronously measuring how much of an element is visible in the viewport.

## Install

```sh
npm install viewability
```

## Use

```ts
import { isElementOnScreen, measure } from 'viewability'

const element = document.querySelector('#target')!
const result = measure(element)

result.value // visible area from 0 to 1
result.visible // any area is visible
result.fullyVisible // the entire element is visible
result.vertical // vertical percentage and position state
result.horizontal // horizontal percentage and position state

isElementOnScreen(element) // any visible area
isElementOnScreen(element, true) // fully visible
```

Focused imports are available from `viewability/vertical`, `viewability/horizontal`, `viewability/isElementOnScreen`, and `viewability/measure`.

CommonJS remains supported:

```js
const { measure } = require('viewability')
const vertical = require('viewability/vertical')
```

The package also includes TypeScript declarations and `dist/viewability.min.js` for script-tag usage. The browser build exposes a global `viewability` object.

## API

- `measure(element)` returns the combined visible-area ratio and both axis results.
- `vertical(element)` returns `{ value, state }` for vertical visibility.
- `horizontal(element)` returns `{ value, state }` for horizontal visibility.
- `isElementOnScreen(element, full?)` returns a visibility boolean.

Each call reads `getBoundingClientRect()` once. Use `IntersectionObserver` instead when continuously observing many elements.

## Develop

Node.js 20 or newer is required.

```sh
npm install
npm run check
npm run test:browser
```

`npm run check` runs Biome, strict typechecking, unit coverage, builds, package validation, and ESM, CommonJS, TypeScript, and Vite consumer tests. Playwright covers Chromium, Firefox, and WebKit.

Run `npm run example` to open the interactive playground at `http://localhost:4173`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions and the release process.

## License

ISC
