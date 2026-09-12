import { writeFile } from 'node:fs/promises'

const wrappers = {
  'index.cjs': `const api = require('./index.bundle.cjs')\nmodule.exports = { vertical: api.vertical, horizontal: api.horizontal, isElementOnScreen: api.isElementOnScreen, measure: api.measure }\n`,
  'vertical.cjs': `const api = require('./vertical.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
  'horizontal.cjs': `const api = require('./horizontal.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
  'is-element-on-screen.cjs': `const api = require('./is-element-on-screen.bundle.cjs')\nmodule.exports = api.default ?? api\n`,
}

await Promise.all(
  Object.entries(wrappers).map(([file, contents]) =>
    writeFile(new URL(`../dist/${file}`, import.meta.url), contents),
  ),
)
