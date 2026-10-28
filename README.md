# viewability

Measure how much of a DOM element overlaps the viewport. Zero runtime dependencies;
ESM, CommonJS, TypeScript declarations, and a browser global are included.

## Install and use

```sh
npm install viewability
```

```js
import { measure } from 'viewability'

const element = document.querySelector('#target')
if (element) {
  console.log(measure(element).value) // visible area, from 0 to 1
}
```

Call after the element mounts. Measurements describe viewport geometry, not
occlusion, ancestor clipping, opacity, or proof that a person saw the element.
Each call reads the element rectangle once. See [API and examples](docs/api.md)
for axis helpers, CommonJS, focused imports, and browser-script usage.

## Develop

Use Node.js 24 (the CI development runtime) or a compatible newer version. The
built package retains Node.js 20+ consumer support.

```sh
npm ci
npm run check
npx playwright install
npm run test:browser
```

`check` verifies style, types, unit coverage, builds, exports, and installed-package
consumers. Browser tests cover Chromium, Firefox, and WebKit. Linux may require
`npx playwright install --with-deps` on a supported host.

Run `npm run example` for the playground at `http://localhost:4173`.
See [contributing](https://github.com/kahwee/viewability/blob/master/CONTRIBUTING.md),
[CI](https://github.com/kahwee/viewability/blob/master/.github/ACTIONS.md), and
[release history](CHANGELOG.md). License: [ISC](LICENSE).
