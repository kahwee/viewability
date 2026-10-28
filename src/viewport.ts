import type { MeasurableElement } from './types.js'

/** DOM rectangles use their owning document's viewport, including inside frames. */
export function viewportFor(el: MeasurableElement): Window {
  const element = el as MeasurableElement & { ownerDocument?: Document | null }
  return element.ownerDocument?.defaultView ?? window
}
