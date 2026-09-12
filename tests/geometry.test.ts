import { describe, expect, it } from 'vitest'
import { measureAxis, type AxisStates } from '../src/geometry.js'

const states: AxisStates<string> = {
  after: 'after', before: 'before', within: 'within', bothTruncated: 'both',
  startTruncated: 'start', endTruncated: 'end', fallback: 'fallback',
}

describe('measureAxis', () => {
  it.each([
    { start: 101, end: 141, expected: { value: 0, state: 'after' } },
    { start: -40, end: 0, expected: { value: 0, state: 'before' } },
    { start: 0, end: 40, expected: { value: 1, state: 'within' } },
    { start: -50, end: 150, expected: { value: 0.5, state: 'both' } },
    { start: -10, end: 30, expected: { value: 0.75, state: 'start' } },
    { start: 70, end: 110, expected: { value: 0.75, state: 'end' } },
    { start: 100, end: 140, expected: { value: 0, state: 'end' } },
  ])('measures [$start, $end]', ({ start, end, expected }) => {
    expect(measureAxis(start, end, 100, states)).toEqual(expected)
  })

  it('retains the 1.x fallback for invalid numeric input', () => {
    expect(measureAxis(Number.NaN, 10, 100, states)).toEqual({ value: 0, state: 'fallback' })
  })

  it.each([
    [0, 0, { value: 0, state: 'before' }],
    [100, 100, { value: 1, state: 'within' }],
    [100, 101, { value: 0, state: 'end' }],
  ])('preserves the 1.x boundary result for [%s, %s]', (start, end, expected) => {
    expect(measureAxis(start, end, 100, states)).toEqual(expected)
  })
})
