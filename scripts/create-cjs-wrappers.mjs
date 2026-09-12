import { writeFile } from 'node:fs/promises'

const wrappers = {
  'index.cjs': `const api = require('./index.bundle.cjs')\nmodule.exports = { vertical: api.vertical, horizontal: api.horizontal, isElementOnScreen: api.isElementOnScreen, measure: api.measure }\n`,
  'vertical.cjs': `const api = require('./vertical.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
  'horizontal.cjs': `const api = require('./horizontal.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
  'is-element-on-screen.cjs': `const api = require('./is-element-on-screen.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
  'measure.cjs': `const api = require('./measure.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
  'index.d.cts': `declare const api: {\n  vertical: typeof import('./vertical.js').default\n  horizontal: typeof import('./horizontal.js').default\n  isElementOnScreen: typeof import('./is-element-on-screen.js').default\n  measure: typeof import('./measure.js').default\n}\nexport = api\n`,
  'vertical.d.cts': `declare const vertical: typeof import('./vertical.js').default\nexport = vertical\n`,
  'horizontal.d.cts': `declare const horizontal: typeof import('./horizontal.js').default\nexport = horizontal\n`,
  'is-element-on-screen.d.cts': `declare const isElementOnScreen: typeof import('./is-element-on-screen.js').default\nexport = isElementOnScreen\n`,
  'measure.d.cts': `declare const measure: typeof import('./measure.js').default\nexport = measure\n`,
}

await Promise.all(
  Object.entries(wrappers).map(([file, contents]) =>
    writeFile(new URL(`../dist/${file}`, import.meta.url), contents),
  ),
)
