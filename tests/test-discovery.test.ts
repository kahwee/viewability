import { expect, it } from 'vitest'
import { configDefaults } from 'vitest/config'
import config from '../vitest.config.js'

it('keeps dependency and generated-file exclusions alongside browser tests', () => {
  expect(config.test?.exclude).toEqual(
    expect.arrayContaining([...configDefaults.exclude, 'tests/browser/**']),
  )
})
