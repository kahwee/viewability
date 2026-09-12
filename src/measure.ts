import { measureHorizontalRect } from './horizontal.js'
import { measureVerticalRect } from './vertical.js'
import type { MeasurableElement, ViewabilityMeasurement } from './types.js'

export default function measure(el: MeasurableElement): ViewabilityMeasurement {
  const { top, bottom, left, right } = el.getBoundingClientRect()
  const verticalResult = measureVerticalRect(top, bottom)
  const horizontalResult = measureHorizontalRect(left, right)
  const value = verticalResult.value * horizontalResult.value

  return { value, visible: value > 0, fullyVisible: value === 1, vertical: verticalResult, horizontal: horizontalResult }
}
