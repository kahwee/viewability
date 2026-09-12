import { beforeEach, describe, expect, it, vi } from 'vitest'
import horizontal from '../src/horizontal.js'
import { elementAt } from './helpers.js'

describe('horizontal', () => {
  beforeEach(() => vi.stubGlobal('window', { innerHeight: 100, innerWidth: 100 }))

  it.each([
    [101, 141, 0, 'EL_IS_TOO_RIGHT'],
    [-40, 0, 0, 'EL_IS_TOO_LEFT'],
    [10, 50, 1, 'EL_IS_WITHIN_HORIZONTAL_VIEW'],
    [-50, 150, 0.5, 'EL_LEFT_AND_RIGHT_TRUNCATED'],
    [-10, 30, 0.75, 'EL_LEFT_TRUNCATED'],
    [70, 110, 0.75, 'EL_RIGHT_TRUNCATED'],
  ])('measures left %s and right %s', (left, right, value, state) => {
    expect(horizontal(elementAt({ top: 0, bottom: 40, left, right }))).toEqual({ value, state })
  })

  it('reads the element rectangle once', () => {
    const onRead = vi.fn()
    horizontal(elementAt({ top: 0, bottom: 40, left: 0, right: 40 }, onRead))
    expect(onRead).toHaveBeenCalledOnce()
  })
})
