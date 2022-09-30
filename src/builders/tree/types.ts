import * as d3 from 'd3'

export type INode<Datum> = d3.HierarchyPointNode<Datum>
export type ILink<Datum> = d3.HierarchyPointLink<Datum>

export interface ITreeSettings<Datum> {
  rootSvgSelector: string
  rootGroupSelector: string
  nodeTextDataKey: keyof Datum
}
