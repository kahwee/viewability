import { measureAxis } from './geometry.js'
import type { HorizontalState, MeasurableElement, ViewabilityResult } from './types.js'

const states = {
  after: 'EL_IS_TOO_RIGHT',
  before: 'EL_IS_TOO_LEFT',
  within: 'EL_IS_WITHIN_HORIZONTAL_VIEW',
  bothTruncated: 'EL_LEFT_AND_RIGHT_TRUNCATED',
  startTruncated: 'EL_LEFT_TRUNCATED',
  endTruncated: 'EL_RIGHT_TRUNCATED',
  fallback: 'EL_IS_NOT_WITHIN_VIEW',
} as const

export default function horizontal(el: MeasurableElement): ViewabilityResult<HorizontalState> {
  const { left, right } = el.getBoundingClientRect()
  return measureHorizontalRect(left, right)
}

export function measureHorizontalRect(
  left: number,
  right: number,
): ViewabilityResult<HorizontalState> {
  return measureAxis(left, right, window.innerWidth, states)
}
