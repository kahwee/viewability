export type VerticalState =
  | 'EL_IS_BELOW_VIEW'
  | 'EL_IS_ABOVE_VIEW'
  | 'EL_IS_WITHIN_VERTICAL_VIEW'
  | 'EL_BOTTOM_AND_TOP_TRUNCATED'
  | 'EL_TOP_TRUNCATED'
  | 'EL_BOTTOM_TRUNCATED'
  | 'EL_IS_NOT_WITHIN_VIEW'

export type HorizontalState =
  | 'EL_IS_TOO_RIGHT'
  | 'EL_IS_TOO_LEFT'
  | 'EL_IS_WITHIN_HORIZONTAL_VIEW'
  | 'EL_LEFT_AND_RIGHT_TRUNCATED'
  | 'EL_LEFT_TRUNCATED'
  | 'EL_RIGHT_TRUNCATED'
  | 'EL_IS_NOT_WITHIN_VIEW'

export interface ViewabilityResult<State extends string = string> {
  value: number
  state: State
}

export interface ViewabilityMeasurement {
  value: number
  visible: boolean
  fullyVisible: boolean
  vertical: ViewabilityResult<VerticalState>
  horizontal: ViewabilityResult<HorizontalState>
}

export type MeasurableElement = Pick<Element, 'getBoundingClientRect'>
