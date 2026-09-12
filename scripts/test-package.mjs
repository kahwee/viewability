import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import vm from 'node:vm'

const temporaryDirectory = await mkdtemp(join(tmpdir(), 'viewability-package-'))

try {
  execFileSync('npm', ['pack', '--ignore-scripts', '--pack-destination', temporaryDirectory], {
    stdio: 'pipe',
  })
  const archive = (await readdir(temporaryDirectory)).find((file) => file.endsWith('.tgz'))
  assert.ok(archive, 'npm pack did not create an archive')

  execFileSync('npm', ['install', '--ignore-scripts', join(temporaryDirectory, archive)], {
    cwd: temporaryDirectory,
    stdio: 'pipe',
  })

  execFileSync(
    'node',
    [
      '--input-type=module',
      '--eval',
      `
    import viewability, { vertical } from 'viewability'
    import verticalDirect from 'viewability/vertical'
    import verticalWithExtension from 'viewability/vertical.js'
    import measure from 'viewability/measure'
    if (typeof viewability.measure !== 'function' || typeof vertical !== 'function' || typeof verticalDirect !== 'function' || typeof verticalWithExtension !== 'function' || typeof measure !== 'function') process.exit(1)
  `,
    ],
    { cwd: temporaryDirectory, stdio: 'pipe' },
  )

  execFileSync(
    'node',
    [
      '--eval',
      `
    const viewability = require('viewability')
    if (typeof viewability.vertical !== 'function') process.exit(1)
    if (typeof require('viewability/vertical') !== 'function') process.exit(1)
    if (typeof require('viewability/horizontal') !== 'function') process.exit(1)
    if (typeof require('viewability/isElementOnScreen') !== 'function') process.exit(1)
    if (typeof require('viewability/vertical.js') !== 'function') process.exit(1)
    if (typeof require('viewability/horizontal.js') !== 'function') process.exit(1)
    if (typeof require('viewability/isElementOnScreen.js') !== 'function') process.exit(1)
    if (typeof require('viewability/measure') !== 'function') process.exit(1)
  `,
    ],
    { cwd: temporaryDirectory, stdio: 'pipe' },
  )

  const packageRoot = join(temporaryDirectory, 'node_modules', 'viewability')
  const browserBundle = await readFile(join(packageRoot, 'dist', 'viewability.min.js'), 'utf8')
  const context = { window: { innerHeight: 100, innerWidth: 100 } }
  vm.runInNewContext(browserBundle, context)
  assert.equal(typeof context.viewability.vertical, 'function')
  const result = context.viewability.measure({
    getBoundingClientRect: () => ({ top: -10, bottom: 30, left: 50, right: 150 }),
  })
  assert.equal(result.value, 0.375)
  assert.equal(result.vertical.state, 'EL_TOP_TRUNCATED')
  assert.equal(result.horizontal.state, 'EL_RIGHT_TRUNCATED')
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true })
}
