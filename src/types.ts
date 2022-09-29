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

export type NodesSelection<T> = d3.Selection<
  SVGGElement,
  d3.HierarchyPointNode<T>,
  SVGGElement,
  unknown
>

export type LinksSelection<T> = d3.Selection<
  SVGPathElement,
  d3.HierarchyPointLink<T>,
  SVGGElement,
  unknown
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
