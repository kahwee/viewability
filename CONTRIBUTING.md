# Contributing

## Setup

Use Node.js 20 or newer:

```sh
npm install
npm run check
```

## Design conventions

- Keep viewport geometry in small pure functions.
- Keep browser API reads at the public-function boundary.
- Preserve the 1.x state names and boundary semantics unless a major release explicitly changes them.
- Add table-driven regression tests for every geometry change.
- Do not add runtime dependencies without a compelling browser-size justification.

## Compatibility

The package supports ESM, CommonJS, TypeScript, and a browser global. `scripts/test-package.mjs` installs the packed artifact and verifies every supported entry point. Update that test whenever exports change.

## Pull requests

Before opening a pull request, run:

```sh
npm run check
npm audit --omit=dev
```
