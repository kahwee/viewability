import { verticalInViewport } from './geometry.js'
import type { MeasurableElement, VerticalState, ViewabilityResult } from './types.js'
import { viewportFor } from './viewport.js'

export default function vertical(el: MeasurableElement): ViewabilityResult<VerticalState> {
  const { top, bottom } = el.getBoundingClientRect()
  return verticalInViewport(top, bottom, viewportFor(el).innerHeight)
}

export function measureVerticalRect(top: number, bottom: number): ViewabilityResult<VerticalState> {
  return verticalInViewport(top, bottom, window.innerHeight)
}
