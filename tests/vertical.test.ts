import { beforeEach, describe, expect, it, vi } from 'vitest'
import vertical from '../src/vertical.js'
import { elementAt } from './helpers.js'

describe('vertical', () => {
  beforeEach(() => vi.stubGlobal('window', { innerHeight: 100, innerWidth: 100 }))

  it.each([
    [101, 141, 0, 'EL_IS_BELOW_VIEW'],
    [-40, 0, 0, 'EL_IS_ABOVE_VIEW'],
    [10, 50, 1, 'EL_IS_WITHIN_VERTICAL_VIEW'],
    [-50, 150, 0.5, 'EL_BOTTOM_AND_TOP_TRUNCATED'],
    [-10, 30, 0.75, 'EL_TOP_TRUNCATED'],
    [70, 110, 0.75, 'EL_BOTTOM_TRUNCATED'],
  ])('measures top %s and bottom %s', (top, bottom, value, state) => {
    expect(vertical(elementAt({ top, bottom, left: 0, right: 40 }))).toEqual({ value, state })
  })

  it('reads the element rectangle once', () => {
    const onRead = vi.fn()
    vertical(elementAt({ top: 0, bottom: 40, left: 0, right: 40 }, onRead))
    expect(onRead).toHaveBeenCalledOnce()
  })
})
