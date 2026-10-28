import { horizontalInViewport } from './geometry.js'
import type { HorizontalState, MeasurableElement, ViewabilityResult } from './types.js'
import { viewportFor } from './viewport.js'

export default function horizontal(el: MeasurableElement): ViewabilityResult<HorizontalState> {
  const { left, right } = el.getBoundingClientRect()
  return horizontalInViewport(left, right, viewportFor(el).innerWidth)
}

export function measureHorizontalRect(
  left: number,
  right: number,
): ViewabilityResult<HorizontalState> {
  return horizontalInViewport(left, right, window.innerWidth)
}
