import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const output = await mkdtemp(join(tmpdir(), 'viewability-vite-'))

function run(modulePath, args) {
  execFileSync(process.execPath, [fileURLToPath(new URL(modulePath, root)), ...args], {
    cwd: root,
    stdio: 'inherit',
  })
}

try {
  run('fixtures/node-esm/index.mjs', [])
  run('fixtures/node-cjs/index.cjs', [])
  run('node_modules/typescript/bin/tsc', ['-p', 'fixtures/typescript-esm'])
  run('node_modules/typescript/bin/tsc', ['-p', 'fixtures/typescript-cjs'])
  run('node_modules/vite/bin/vite.js', [
    'build',
    'fixtures/vite',
    '--outDir',
    output,
    '--emptyOutDir',
  ])
} finally {
  await rm(output, { recursive: true, force: true })
}
