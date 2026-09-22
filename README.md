# viewability

A tiny, zero-dependency browser library that synchronously measures how much of a DOM element is visible in the viewport.

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

The package ships ESM, CommonJS, TypeScript declarations, focused subpath exports, and `dist/viewability.min.js` for script tags. The browser build exposes a global `viewability` object.

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
npx playwright install
npm run test:browser
```

On Linux, WebKit may also need system libraries. Use
`npx playwright install --with-deps` on a supported host when Playwright reports
missing libraries.

`npm run check` runs Biome, native TypeScript (`tsgo`) checking, 100% unit coverage, builds, package validation, and ESM, CommonJS, TypeScript, and Vite consumer tests. Playwright covers Chromium, Firefox, and WebKit.

Run `npm run example` to open the interactive playground at `http://localhost:4173`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions and the release process.

## License

ISC
