import viewability = require('viewability')
import measure = require('viewability/measure')
import vertical = require('viewability/vertical')

declare const element: Element
const value: number = measure(element).value
const state: string = vertical(element).state
const visible: boolean = viewability.isElementOnScreen(element)
void [value, state, visible]
