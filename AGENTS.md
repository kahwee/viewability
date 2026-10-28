# Viewability

- Use Node.js 24 for development, matching CI; support Node.js 24+ package consumers.
- Preserve the public API and CommonJS subpaths.
- Keep runtime dependencies at zero.
- Read each element rectangle only once per public call.
- Add tests for every behavior change.
- Run `npm run check` and relevant Playwright tests before committing. Install
  browser binaries with `npx playwright install` when the local cache is empty;
  Linux hosts may also need `npx playwright install --with-deps`.
- Never commit `dist`, coverage, or Playwright output.
- For greenkeeping, run `npm outdated` and `npm audit --omit=dev` first. Prefer
  compatible updates, commit `package-lock.json`, and keep the Node versions in
  CI compatible with the `engines` range.
- Keep dependency updates focused. Isolate major build-tool upgrades from
  behavior changes and validate the packed ESM, CommonJS, and browser outputs.
- CI already runs independent source checks in parallel. Keep package generation
  before shared-artifact consumers and browser jobs; do not race `dist` writes.
- Keep the concise README linked to [API details](docs/api.md) and contributor
  guidance. Preserve geometry limitations and the ISC license.
- The active tag workflow creates GitHub artifacts, not npm publications.
  The npm proposal in `.github/release-proposals/` remains inactive; activation
  or registry trust changes require separate approval. Do not tag or publish as a test.
