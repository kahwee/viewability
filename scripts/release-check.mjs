import { appendFileSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export function validateRelease(pkg, tag, lock) {
  if (pkg.private) throw new Error('Private packages cannot be published')
  if (!pkg.name || !/^\d+\.\d+\.\d+$/.test(pkg.version)) {
    throw new Error('A stable package name and version are required')
  }
  if (tag !== `v${pkg.version}`) {
    throw new Error('Release tag must match package.json version')
  }
  if (lock && (lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version)) {
    throw new Error('Root package-lock version must match package.json')
  }
  return pkg.version
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
    const state = process.argv.includes('--registry') ? await registryState(pkg) : 'unchecked'
    console.log(`Validated ${pkg.name}@${version}; registry: ${state}`)
    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(
        process.env.GITHUB_OUTPUT,
        `package_version=${version}\nshould_publish=${state !== 'published'}\n`,
      )
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
