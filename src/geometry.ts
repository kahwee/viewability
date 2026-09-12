import type { ViewabilityResult } from './types.js'

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
  if (start >= 0 && end > viewportSize) {
    return { value: (viewportSize - start) / elementSize, state: states.endTruncated }
  }

  return { value: 0, state: states.fallback }
}
