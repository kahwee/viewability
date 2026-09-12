# Repository guidance

Read `README.md` for the public API and `CONTRIBUTING.md` for development conventions.

Important compatibility constraints:

- Preserve the established `vertical`, `horizontal`, and `isElementOnScreen` behavior.
- Preserve CommonJS callable subpaths such as `require('viewability/vertical')`.
- Keep the package free of runtime dependencies.
- Read each element rectangle at most once per public function call.
- Run `npm run check` before committing.

Generated files in `dist/` and `coverage/` are not committed.
