import viewability, { measure, type ViewabilityMeasurement } from 'viewability'
import vertical from 'viewability/vertical'

declare const element: Element
const result: ViewabilityMeasurement = measure(element)
const value: number = vertical(element).value
const visible: boolean = viewability.isElementOnScreen(element)
void [result, value, visible]
