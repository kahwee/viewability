import './check-release-archive.mjs'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { registryState, validateRelease } from './release-check.mjs'

const pkg = { name: 'example-package', version: '1.2.3' }
test('matches tag, rejects private, prerelease, mismatched tag and lock', () => {
  assert.equal(validateRelease(pkg, 'v1.2.3'), '1.2.3')
  for (const [candidate, tag, lock] of [
    [{ ...pkg, private: true }, 'v1.2.3'],
    [{ ...pkg, version: '1.2.3-rc.1' }, 'v1.2.3-rc.1'],
    [pkg, 'v1.2.4'],
    [pkg, 'main'],
    [pkg, 'v1.2.3', { version: '1.2.2', packages: { '': { version: '1.2.2' } } }],
  ])
    assert.throws(() => validateRelease(candidate, tag, lock))
  assert.equal(
    validateRelease(pkg, 'v1.2.3', { version: '1.2.3', packages: { '': { version: '1.2.3' } } }),
    '1.2.3',
  )
})
test('only a registry 404 permits publication; 200 is immutable', async () => {
  assert.equal(await registryState(pkg, async () => ({ status: 404 })), 'new')
  assert.equal(
    await registryState(pkg, async () => ({ status: 200, json: async () => pkg })),
    'published',
  )
  for (const status of [401, 403, 429, 500, 503]) {
    await assert.rejects(registryState(pkg, async () => ({ status })))
  }
  await assert.rejects(
    registryState(pkg, async () => {
      throw new Error('timeout')
    }),
  )
  await assert.rejects(
    registryState(pkg, async () => ({
      status: 200,
      json: async () => ({ ...pkg, version: '9.9.9' }),
    })),
  )
})

test('CLI validates real repository metadata and fails invalid fixture releases', () => {
  const script = fileURLToPath(new URL('./release-check.mjs', import.meta.url))
  const repo = resolve(dirname(script), '..')
  const actual = JSON.parse(readFileSync(resolve(repo, 'package.json'), 'utf8'))
  assert.equal(spawnSync(process.execPath, [script, `v${actual.version}`], { cwd: repo }).status, 0)
  const directory = mkdtempSync(resolve(tmpdir(), 'release-guard-'))
  try {
    const output = resolve(directory, 'output')
    const run = (candidate, tag, lock) => {
      writeFileSync(resolve(directory, 'package.json'), JSON.stringify(candidate))
      if (lock) writeFileSync(resolve(directory, 'package-lock.json'), JSON.stringify(lock))
      else rmSync(resolve(directory, 'package-lock.json'), { force: true })
      return spawnSync(process.execPath, [script, tag], {
        cwd: directory,
        env: { ...process.env, GITHUB_OUTPUT: output },
      })
    }
    assert.equal(run(pkg, 'v1.2.3').status, 0)
    assert.match(readFileSync(output, 'utf8'), /package_version=1.2.3\nshould_publish=true/)
    assert.equal(run(pkg, 'v1.2.4').status, 1)
    assert.equal(run({ ...pkg, private: true }, 'v1.2.3').status, 1)
    assert.equal(
      run(pkg, 'v1.2.3', { version: '1.2.2', packages: { '': { version: '1.2.2' } } }).status,
      1,
    )
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
