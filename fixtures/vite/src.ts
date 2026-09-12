import { measure } from 'viewability'

const target = document.querySelector('#target')
if (!(target instanceof HTMLElement)) throw new Error('Fixture target is missing')
target.dataset.visible = String(measure(target).visible)
