# Project guidance

- Preserve the public API and CommonJS subpaths.
- Keep runtime dependencies at zero.
- Read each element rectangle only once per public call.
- Add tests for every behavior change.
- Run `npm run check` and relevant Playwright tests before committing.
- Never commit `dist`, coverage, or Playwright output.
