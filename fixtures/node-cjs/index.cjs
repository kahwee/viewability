const assert = require('node:assert/strict')

global.window = { innerHeight: 100, innerWidth: 100 }
const viewability = require('viewability')
const vertical = require('viewability/vertical')
const measure = require('viewability/measure')

const element = { getBoundingClientRect: () => ({ top: 0, bottom: 50, left: 0, right: 50 }) }
assert.equal(viewability.horizontal(element).value, 1)
assert.equal(vertical(element).value, 1)
assert.equal(measure(element).value, 1)
