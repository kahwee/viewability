# Migrating to 2.0.0 (release candidate)

Compared with npm 1.3.4, consumers need Node.js 24 or newer, and browsers or bundlers that support ES2018. Development uses Node.js 24.

Package exports now encapsulate arbitrary and internal paths. Replace `viewability/viewability.js` with the documented root `viewability`. For a browser script, replace the old `dist/viewability.js` artifact with `dist/viewability.min.js`. The root, `vertical`, `horizontal`, `isElementOnScreen`, and their historical `.js` subpath aliases remain supported. See [API and examples](api.md).

ESM, TypeScript declarations, and `measure` are additions. DOM elements inside same-origin iframes are measured against their owning document’s viewport.

This is a candidate, not a published release. Earlier 1.x entries in the changelog record repository history and do not imply every candidate was published to npm.
