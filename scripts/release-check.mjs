import { createHash } from 'node:crypto'
import { appendFileSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

export function validateRelease(pkg, tag, lock) {
  if (pkg.private) throw new Error('Private packages cannot be published')
  if (typeof pkg.name !== 'string' || !pkg.name || !stable.test(pkg.version)) {
    throw new Error('A stable package name and version are required')
  }
  if (tag !== `v${pkg.version}`) throw new Error('Release tag must match package.json version')
  if (lock && (lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version)) {
    throw new Error('Root package-lock version must match package.json')
  }
  return pkg.version
}

export function compareVersions(a, b) {
  if (!stable.test(a) || !stable.test(b)) throw new Error('Invalid stable registry version')
  const left = a.split('.')
  const right = b.split('.')
  for (let i = 0; i < 3; i++) {
    if (left[i].length !== right[i].length) return left[i].length < right[i].length ? -1 : 1
    if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1
  }
  return 0
}

export function archiveIntegrity(bytes) {
  return `sha512-${createHash('sha512').update(bytes).digest('base64')}`
}

async function metadata(pkg, request) {
  const response = await request(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`, {
    signal: AbortSignal.timeout(15000),
    headers: { accept: 'application/json' },
  })
  if (response.status === 404) return null
  if (response.status !== 200) throw new Error(`Registry lookup failed (HTTP ${response.status})`)
  const data = await response.json()
  if (
    !data ||
    data.name !== pkg.name ||
    !data.versions ||
    typeof data.versions !== 'object' ||
    Array.isArray(data.versions) ||
    !data['dist-tags'] ||
    typeof data['dist-tags'] !== 'object' ||
    Array.isArray(data['dist-tags'])
  ) {
    throw new Error('Malformed or inconsistent registry metadata')
  }
  const latest = data['dist-tags'].latest
  if (typeof latest !== 'string' || !stable.test(latest) || !Object.hasOwn(data.versions, latest)) {
    throw new Error('Malformed registry latest metadata')
  }
  const latestEntry = data.versions[latest]
  if (!latestEntry || latestEntry.name !== pkg.name || latestEntry.version !== latest) {
    throw new Error('Registry latest identity mismatch')
  }
  return data
}

function checkArchive(pkg, entry, integrity) {
  if (!entry || entry.name !== pkg.name || entry.version !== pkg.version)
    throw new Error('Registry version identity mismatch')
  if (typeof entry.dist?.integrity !== 'string' || entry.dist.integrity !== integrity)
    throw new Error('Registry archive integrity mismatch')
}

export async function registryArchiveState(pkg, integrity, request = fetch) {
  const data = await metadata(pkg, request)
  if (!data) throw new Error('Registry package not found; publication stopped')
  if (Object.hasOwn(data.versions, pkg.version)) {
    checkArchive(pkg, data.versions[pkg.version], integrity)
    return 'published'
  }
  if (compareVersions(data['dist-tags'].latest, pkg.version) >= 0) {
    throw new Error('Refusing to publish an older or inconsistent version to latest')
  }
  return 'new'
}

export async function verifyPublished(
  pkg,
  integrity,
  {
    request = fetch,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    attempts = 6,
    delay = 5000,
  } = {},
) {
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 6)
    throw new Error('Verification attempts must be between 1 and 6')
  for (let attempt = 0; attempt < attempts; attempt++) {
    const data = await metadata(pkg, request)
    if (data && Object.hasOwn(data.versions, pkg.version)) {
      checkArchive(pkg, data.versions[pkg.version], integrity)
      if (compareVersions(data['dist-tags'].latest, pkg.version) >= 0) return
    }
    if (attempt + 1 < attempts) await sleep(delay)
  }
  throw new Error(`Registry verification exhausted ${attempts} attempts`)
}

export async function registryState(pkg, request = fetch) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/${pkg.version}`
  const response = await request(url, { signal: AbortSignal.timeout(15000) })
  if (response.status === 404) return 'new'
  if (response.status === 200) {
    const published = await response.json()
    if (published.name !== pkg.name || published.version !== pkg.version) {
      throw new Error('Registry returned inconsistent package metadata')
    }
    return 'published'
  }
  throw new Error(`Registry lookup failed (HTTP ${response.status}); publication stopped`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    let lock
    try {
      lock = JSON.parse(readFileSync('package-lock.json', 'utf8'))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    const version = validateRelease(pkg, process.argv[2], lock)
    const mode = process.argv[3]
    let state = 'unchecked'
    if (mode === '--registry' && !process.argv[4]) state = await registryState(pkg)
    else if (mode === '--registry' || mode === '--verify') {
      const integrity = archiveIntegrity(readFileSync(process.argv[4]))
      if (mode === '--registry') state = await registryArchiveState(pkg, integrity)
      else {
        await verifyPublished(pkg, integrity)
        state = 'verified'
      }
    }
    console.log(`Validated ${pkg.name}@${version}; registry: ${state}`)
    if (process.env.GITHUB_OUTPUT && mode !== '--verify')
      appendFileSync(
        process.env.GITHUB_OUTPUT,
        `package_version=${version}\nshould_publish=${state !== 'published'}\n`,
      )
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
