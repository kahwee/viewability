import { measureAxis } from './geometry.js'
import type { MeasurableElement, VerticalState, ViewabilityResult } from './types.js'

const states = {
  after: 'EL_IS_BELOW_VIEW', before: 'EL_IS_ABOVE_VIEW', within: 'EL_IS_WITHIN_VERTICAL_VIEW',
  bothTruncated: 'EL_BOTTOM_AND_TOP_TRUNCATED', startTruncated: 'EL_TOP_TRUNCATED',
  endTruncated: 'EL_BOTTOM_TRUNCATED', fallback: 'EL_IS_NOT_WITHIN_VIEW',
} as const

export default function vertical(el: MeasurableElement): ViewabilityResult<VerticalState> {
  const { top, bottom } = el.getBoundingClientRect()
  return measureVerticalRect(top, bottom)
}

export function measureVerticalRect(top: number, bottom: number): ViewabilityResult<VerticalState> {
  return measureAxis(top, bottom, window.innerHeight, states)
}
