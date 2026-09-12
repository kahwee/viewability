import type { MeasurableElement } from '../src/types.js'

export interface RectInput {
  top: number
  bottom: number
  left: number
  right: number
}

export function elementAt(rect: RectInput, onRead?: () => void): MeasurableElement {
  return {
    getBoundingClientRect() {
      onRead?.()
      return {
        ...rect,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top,
        x: rect.left,
        y: rect.top,
        toJSON: () => rect,
      }
    },
  }
}
