import measure from './measure.js'
import type { MeasurableElement } from './types.js'

export default function isElementOnScreen(el: MeasurableElement, full = false): boolean {
  const { value } = measure(el)
  return full ? value === 1 : value > 0
}
