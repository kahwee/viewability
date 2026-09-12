import { readFile } from 'node:fs/promises'

const tag = process.argv[2]
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const expected = `v${packageJson.version}`

if (tag !== expected) {
  console.error(`Release tag ${tag ?? '(missing)'} does not match package version ${expected}`)
  process.exitCode = 1
}
