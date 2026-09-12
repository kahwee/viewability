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

Run `npm run test:browser` for changes that affect geometry, browser compatibility, the browser bundle, or the interactive example. GitHub Actions executes the suite independently in Chromium, Firefox, and WebKit.

## Releases

1. Update `package.json`, `package-lock.json`, and `CHANGELOG.md`.
2. Run `npm run check` and `npm run test:browser`.
3. Commit and push the release preparation.
4. Create and push an annotated `v<package version>` tag.

The release workflow rejects mismatched tags, repeats all checks, runs all three browser engines, and creates the GitHub release only after everything passes.
