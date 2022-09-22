import * as d3 from 'd3'

export type Builder = (
  svg: SVGSelectionRoot,
  settings: Required<ISettings>
) => void

export type SVGSelectionRoot = d3.Selection<
  SVGGElement,
  unknown,
  HTMLElement,
  any
>

export interface ISettings {
  height: number
  id: string
  rootSelector: string
  contentSelector?: string
  innerWidth?: number
  innerHeight?: number
  padding: number
  width: number
}
