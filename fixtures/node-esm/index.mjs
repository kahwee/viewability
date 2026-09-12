import assert from 'node:assert/strict'

globalThis.window = { innerHeight: 100, innerWidth: 100 }
const { measure, vertical } = await import('viewability')
const verticalDirect = (await import('viewability/vertical')).default

const element = { getBoundingClientRect: () => ({ top: 0, bottom: 50, left: 0, right: 50 }) }
assert.equal(measure(element).value, 1)
assert.equal(vertical(element).value, 1)
assert.equal(verticalDirect(element).value, 1)
