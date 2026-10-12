import assert from 'node:assert/strict'
import test from 'node:test'
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
