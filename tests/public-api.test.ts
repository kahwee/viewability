import { beforeEach, describe, expect, it, vi } from 'vitest'
import viewability, { horizontal, isElementOnScreen, measure, vertical } from '../src/index.js'
import { elementAt } from './helpers.js'

describe('public API', () => {
  beforeEach(() => vi.stubGlobal('window', { innerHeight: 100, innerWidth: 100 }))

  it('exposes named and default APIs', () => {
    expect(viewability).toEqual({ vertical, horizontal, isElementOnScreen, measure })
  })

  it('returns a combined measurement from one rectangle read', () => {
    const onRead = vi.fn()
    expect(measure(elementAt({ top: -10, bottom: 30, left: 50, right: 150 }, onRead))).toEqual({
      value: 0.375,
      visible: true,
      fullyVisible: false,
      vertical: { value: 0.75, state: 'EL_TOP_TRUNCATED' },
      horizontal: { value: 0.5, state: 'EL_RIGHT_TRUNCATED' },
    })
    expect(onRead).toHaveBeenCalledOnce()
  })

  it.each([
    [{ top: 0, bottom: 40, left: 0, right: 40 }, false, true],
    [{ top: 0, bottom: 40, left: -20, right: 20 }, false, true],
    [{ top: 0, bottom: 40, left: -20, right: 20 }, true, false],
    [{ top: 101, bottom: 141, left: 0, right: 40 }, false, false],
  ])('checks screen visibility', (rect, full, expected) => {
    expect(isElementOnScreen(elementAt(rect), full)).toBe(expected)
  })

  it('reads the rectangle only once for a boolean check', () => {
    const onRead = vi.fn()
    isElementOnScreen(elementAt({ top: 0, bottom: 40, left: 0, right: 40 }, onRead))
    expect(onRead).toHaveBeenCalledOnce()
  })

  it('uses the viewport dimensions at call time', () => {
    const element = elementAt({ top: 60, bottom: 120, left: 60, right: 120 })
    expect(measure(element).value).toBeCloseTo(4 / 9)
    vi.stubGlobal('window', { innerHeight: 200, innerWidth: 200 })
    expect(measure(element).value).toBe(1)
  })
})
