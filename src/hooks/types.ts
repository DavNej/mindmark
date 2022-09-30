type Point = { x: number; y: number }

export interface ISettings {
  id?: string
  rootDivSelector?: string

  height?: number | string
  width?: number | string

  padding?: number

  rootSvgSelector?: string
  rootGroupSelector?: string

  rootSvgRect?: DOMRect
  rootGroupRect?: DOMRect

  rootSvgOrigin?: Point
  rootGroupOrigin?: Point
}

export type Builder = (settings: Required<ISettings>) => void
