import * as d3 from 'd3'

import { SVGSelectionRoot, NodesSelection, LinksSelection } from '../../types'
import {
  NODE_SIZE,
  MAX_TEXT_BREADTH,
  FONT_FAMILY,
  FONT_SIZE,
  NODE_PADDING,
} from './constants'

type INode<Datum> = d3.HierarchyPointNode<Datum>
type ILink<Datum> = d3.HierarchyPointLink<Datum>

interface Settings<Datum> {
  nodeTextDataKey: keyof Datum
}

export class Tree<Datum extends { id: string }> {
  svg: {
    root: SVGSelectionRoot
    nodes?: NodesSelection<Datum>
    branches?: LinksSelection<Datum>
  }
  root: unknown
  private tree: INode<Datum>
  private nodeBreadths: Record<string, number>

  constructor(
    rootSvgGroup: SVGSelectionRoot,
    data: unknown,
    settings: Settings<Datum>
  ) {
    this.svg = { root: rootSvgGroup }

    // create tree generator to which the root (d3 hierarchy data) is passed
    const treeGenerator = d3.tree().nodeSize(NODE_SIZE) as d3.TreeLayout<Datum>

    // create hierarchy to be passed to the tree generator
    this.root = d3.hierarchy(data)
    this.tree = treeGenerator(this.root as d3.HierarchyNode<Datum>)

    this.nodeBreadths = {}

    this.buildNodes(settings.nodeTextDataKey)
    this.buildBranches()
  }

  buildNodes(nodeTextDataKey: keyof Datum) {
    this.buildNodeGroup().buildNodeText(nodeTextDataKey).buildNodeLine()
  }

  buildNodeGroup() {
    this.svg.nodes = this.svg.root
      .selectAll('.node')
      .data(this.tree.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
    return this
  }

  buildNodeText(dataKey: keyof Datum) {
    if (this.svg.nodes) {
      this.svg.nodes
        .append('text')
        .text(d => String(d.data[dataKey]))
        .attr('y', d => d.x - 4)
        .attr('x', d => d.y)
        .attr('font-family', FONT_FAMILY)
        .attr('font-size', FONT_SIZE)
        .each(this.registerNodeBreadth.bind(this))
    }

    return this
  }

  private registerNodeBreadth(
    d: INode<Datum>,
    i: number,
    elements: SVGTextElement[] | ArrayLike<SVGTextElement>
  ) {
    const textBreadth = Math.ceil(elements[i].getComputedTextLength())
    const fullBreadth = textBreadth + 2 * NODE_PADDING

    this.nodeBreadths[d.data.id] =
      fullBreadth <= MAX_TEXT_BREADTH ? fullBreadth : MAX_TEXT_BREADTH
  }

  buildNodeLine() {
    if (this.svg.nodes) {
      this.svg.nodes
        .append('line')
        .attr('y1', d => d.x)
        .attr('x1', d => d.y)
        .attr('y2', d => d.x)
        .attr('x2', d => d.y + this.nodeBreadths[d.data.id])
        .attr('stroke', 'red')
    }

    return this
  }

  buildBranches() {
    this.svg.branches = this.svg.root
      .selectAll('.branch')
      .data(this.tree.links())
      .enter()
      .append('path')
      .attr('class', '.branch')
      .attr('d', this.linkGenerator.bind(this))
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('fill', 'none')

    return this
  }

  private linkGenerator(link: ILink<Datum>, i: number) {
    const gen = d3.linkHorizontal()

    const shift = this.nodeBreadths[link.source.data.id]

    return gen({
      source: [link.source.y + shift, link.source.x],
      target: [link.target.y, link.target.x],
    })
  }
}
