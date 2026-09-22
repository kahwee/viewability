# Project guidance

- Preserve the public API and CommonJS subpaths.
- Keep runtime dependencies at zero.
- Read each element rectangle only once per public call.
- Add tests for every behavior change.
- Run `npm run check` and relevant Playwright tests before committing.
- Never commit `dist`, coverage, or Playwright output.
- For greenkeeping, run `npm outdated` and `npm audit --omit=dev` first. Prefer
  compatible updates, commit `package-lock.json`, and keep the Node versions in
  CI compatible with the `engines` range.
- Keep dependency updates focused. Isolate major build-tool upgrades from
  behavior changes and validate the packed ESM, CommonJS, and browser outputs.
