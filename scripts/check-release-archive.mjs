import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  archiveIntegrity,
  compareVersions,
  registryArchiveState,
  validateRelease,
  verifyPublished,
} from './release-check.mjs'

const pkg = { name: 'example-package', version: '2.10.0' }
const integrity = archiveIntegrity(Buffer.from('checked tarball'))
const entry = (version, hash = integrity) => ({
  name: pkg.name,
  version,
  dist: { integrity: hash },
})
const data = (latest, versions = { [latest]: entry(latest) }) => ({
  name: pkg.name,
  'dist-tags': { latest },
  versions,
})
const response =
  (body, status = 200) =>
  async () => ({ status, json: async () => body })

test('validates stable release identity and compares unbounded numeric components', () => {
  assert.equal(validateRelease(pkg, 'v2.10.0'), pkg.version)
  for (const bad of ['2.01.0', '2.10.0-rc.1', 'main'])
    assert.throws(() => validateRelease({ ...pkg, version: bad }, `v${bad}`))
  assert.throws(() => validateRelease({ ...pkg, private: true }, 'v2.10.0'))
  assert.throws(() => validateRelease(pkg, 'v2.9.0'))
  assert.throws(() => validateRelease(pkg, 'v2.10.0', { version: '2.9.0' }))
  assert.equal(compareVersions('2.10.0', '2.9.99'), 1)
  assert.equal(compareVersions('999999999999999999999.0.0', '1000000000000000000000.0.0'), -1)
  assert.equal(compareVersions('2.10.0', '2.10.0'), 0)
})

test('existing archives are immutable and newer latest is preserved', async () => {
  await assert.rejects(registryArchiveState(pkg, integrity, response(null, 404)), /not found/)
  assert.equal(await registryArchiveState(pkg, integrity, response(data('2.9.0'))), 'new')
  const versions = { '2.10.0': entry('2.10.0'), '3.0.0': entry('3.0.0') }
  assert.equal(
    await registryArchiveState(pkg, integrity, response(data('3.0.0', versions))),
    'published',
  )
  await verifyPublished(pkg, integrity, { request: response(data('3.0.0', versions)) })
  await assert.rejects(registryArchiveState(pkg, integrity, response(data('3.0.0'))), /Refusing/)
  versions['2.10.0'] = entry('2.10.0', 'sha512-different')
  await assert.rejects(
    registryArchiveState(pkg, integrity, response(data('3.0.0', versions))),
    /integrity/,
  )
  await assert.rejects(
    verifyPublished(pkg, integrity, { request: response(data('3.0.0', versions)) }),
    /integrity/,
  )
})

test('readback retries propagation only and exhausts a finite budget', async () => {
  let calls = 0
  let sleeps = 0
  const request = async () =>
    ++calls === 1 ? { status: 404 } : { status: 200, json: async () => data(pkg.version) }
  await verifyPublished(pkg, integrity, {
    request,
    sleep: async () => {
      sleeps++
    },
  })
  assert.equal(calls, 2)
  assert.equal(sleeps, 1)
  await assert.rejects(
    verifyPublished(pkg, integrity, {
      request: response(null, 404),
      attempts: 3,
      sleep: async () => {},
    }),
    /exhausted 3/,
  )
  calls = 0
  await assert.rejects(
    verifyPublished(pkg, integrity, {
      request: async () => {
        calls++
        return { status: 403 }
      },
      sleep: async () => {},
    }),
    /HTTP 403/,
  )
  assert.equal(calls, 1)
})

test('registry errors and malformed or inconsistent metadata fail closed', async () => {
  for (const status of [401, 403, 429, 500])
    await assert.rejects(registryArchiveState(pkg, integrity, response(null, status)))
  for (const body of [
    {},
    { ...data('2.9.0'), name: 'wrong' },
    data('bad'),
    { ...data('2.9.0'), versions: {} },
    data('2.9.0', { '2.9.0': entry('wrong') }),
  ]) {
    await assert.rejects(registryArchiveState(pkg, integrity, response(body)))
  }
  await assert.rejects(
    registryArchiveState(pkg, integrity, async () => ({
      status: 200,
      json: async () => {
        throw new Error('bad JSON')
      },
    })),
  )
  await assert.rejects(
    registryArchiveState(
      pkg,
      integrity,
      response(data(pkg.version, { [pkg.version]: { ...entry(pkg.version), name: 'wrong' } })),
    ),
  )
})

test('inactive proposal queues publication and verifies after a single upload', () => {
  const workflow = readFileSync(
    new URL('../.github/release-proposals/publish.yml', import.meta.url),
    'utf8',
  )
  assert.match(
    workflow,
    /group: npm-release-viewability\s*\n {2}queue: max\s*\n {2}cancel-in-progress: false/,
  )
  assert.match(workflow, /origin\/master/)
  assert.match(workflow, /head_sha == \$sha/)
  assert.match(workflow, /if: steps.metadata.outputs.should_publish == 'true'/)
  assert.equal((workflow.match(/npm publish /g) || []).length, 1)
  const pack = workflow.indexOf('- name: Pack the checked output')
  const check = workflow.indexOf('- name: Check registry and archive identity')
  const publish = workflow.indexOf('- name: Publish checked tarball')
  const verify = workflow.indexOf('- name: Verify published archive and latest tag')
  assert.ok(pack < check && check < publish && publish < verify)
  assert.match(workflow, /--verify .*release\/\*\.tgz/)
  assert.equal((workflow.match(/id-token: write/g) || []).length, 1)
  assert.doesNotMatch(workflow, /npm dist-tag/)
})

test('default readback budget uses six timed requests and five delays', async () => {
  let calls = 0
  const delays = []
  await assert.rejects(
    verifyPublished(pkg, integrity, {
      request: async (_url, options) => {
        calls++
        assert.ok(options.signal instanceof AbortSignal)
        return { status: 404 }
      },
      sleep: async (ms) => delays.push(ms),
    }),
    /exhausted 6/,
  )
  assert.equal(calls, 6)
  assert.deepEqual(delays, [5000, 5000, 5000, 5000, 5000])
  await assert.rejects(verifyPublished(pkg, integrity, { attempts: 7 }), /between 1 and 6/)
})

test('readback waits for latest propagation and fails immediately on wrong identity', async () => {
  let calls = 0
  const versions = { '2.9.0': entry('2.9.0'), [pkg.version]: entry(pkg.version) }
  await verifyPublished(pkg, integrity, {
    request: async () => ({
      status: 200,
      json: async () => data(++calls === 1 ? '2.9.0' : pkg.version, versions),
    }),
    sleep: async () => {},
  })
  assert.equal(calls, 2)
  calls = 0
  versions[pkg.version] = { ...entry(pkg.version), name: 'wrong' }
  await assert.rejects(
    verifyPublished(pkg, integrity, {
      request: async () => {
        calls++
        return { status: 200, json: async () => data(pkg.version, versions) }
      },
      sleep: async () => {},
    }),
    /identity/,
  )
  assert.equal(calls, 1)
})
