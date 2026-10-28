import { horizontalInViewport, verticalInViewport } from './geometry.js'
import type { MeasurableElement, ViewabilityMeasurement } from './types.js'
import { viewportFor } from './viewport.js'

export default function measure(el: MeasurableElement): ViewabilityMeasurement {
  const { top, bottom, left, right } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = viewportFor(el)
  const verticalResult = verticalInViewport(top, bottom, innerHeight)
  const horizontalResult = horizontalInViewport(left, right, innerWidth)
  const value = verticalResult.value * horizontalResult.value

  return {
    value,
    visible: value > 0,
    fullyVisible: value === 1,
    vertical: verticalResult,
    horizontal: horizontalResult,
  }
}
