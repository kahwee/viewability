import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const output = await mkdtemp(join(tmpdir(), 'viewability-vite-'))

function runNode(modulePath, args = []) {
  execFileSync(process.execPath, [fileURLToPath(new URL(modulePath, root)), ...args], {
    cwd: root,
    stdio: 'inherit',
  })
}

function run(commandPath, args) {
  execFileSync(fileURLToPath(new URL(commandPath, root)), args, {
    cwd: root,
    stdio: 'inherit',
  })
}

try {
  runNode('fixtures/node-esm/index.mjs')
  runNode('fixtures/node-cjs/index.cjs')
  run('node_modules/.bin/tsgo', ['-p', 'fixtures/typescript-esm'])
  run('node_modules/.bin/tsgo', ['-p', 'fixtures/typescript-cjs'])
  runNode('node_modules/vite/bin/vite.js', [
    'build',
    'fixtures/vite',
    '--outDir',
    output,
    '--emptyOutDir',
  ])
} finally {
  await rm(output, { recursive: true, force: true })
}
