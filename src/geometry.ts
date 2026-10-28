import type { HorizontalState, VerticalState, ViewabilityResult } from './types.js'

const horizontalStates = {
  after: 'EL_IS_TOO_RIGHT',
  before: 'EL_IS_TOO_LEFT',
  within: 'EL_IS_WITHIN_HORIZONTAL_VIEW',
  bothTruncated: 'EL_LEFT_AND_RIGHT_TRUNCATED',
  startTruncated: 'EL_LEFT_TRUNCATED',
  endTruncated: 'EL_RIGHT_TRUNCATED',
  fallback: 'EL_IS_NOT_WITHIN_VIEW',
} as const

const verticalStates = {
  after: 'EL_IS_BELOW_VIEW',
  before: 'EL_IS_ABOVE_VIEW',
  within: 'EL_IS_WITHIN_VERTICAL_VIEW',
  bothTruncated: 'EL_BOTTOM_AND_TOP_TRUNCATED',
  startTruncated: 'EL_TOP_TRUNCATED',
  endTruncated: 'EL_BOTTOM_TRUNCATED',
  fallback: 'EL_IS_NOT_WITHIN_VIEW',
} as const

export function horizontalInViewport(
  left: number,
  right: number,
  width: number,
): ViewabilityResult<HorizontalState> {
  return measureAxis(left, right, width, horizontalStates)
}

export function verticalInViewport(
  top: number,
  bottom: number,
  height: number,
): ViewabilityResult<VerticalState> {
  return measureAxis(top, bottom, height, verticalStates)
}

export interface AxisStates<State extends string> {
  after: State
  before: State
  within: State
  bothTruncated: State
  startTruncated: State
  endTruncated: State
  fallback: State
}

/** Measures one axis while preserving the boundary semantics of viewability 1.x. */
export function measureAxis<State extends string>(
  start: number,
  end: number,
  viewportSize: number,
  states: AxisStates<State>,
): ViewabilityResult<State> {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(viewportSize) ||
    end < start
  ) {
    return { value: 0, state: states.fallback }
  }
  const elementSize = end - start

  if (start > viewportSize) return { value: 0, state: states.after }
  if (end <= 0) return { value: 0, state: states.before }
  if (start >= 0 && end <= viewportSize) return { value: 1, state: states.within }
  if (start < 0 && end > viewportSize) {
    return { value: viewportSize / elementSize, state: states.bothTruncated }
  }
  if (start < 0 && end <= viewportSize) {
    return { value: end / elementSize, state: states.startTruncated }
  }
  return { value: (viewportSize - start) / elementSize, state: states.endTruncated }
}
