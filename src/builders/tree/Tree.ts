import * as d3 from 'd3'

import * as params from './constants'
import { ITreeSettings, INode, ILink } from './types'

export class Tree<Datum extends { id: string }> {
  root: unknown

  selector = {
    nodes: '.node',
    branches: '.branch',
    rootSvg: '',
    rootGroup: '',
  }

  private tree: INode<Datum>
  private nodeBreadths: Record<string, number>

  constructor(data: unknown, settings: ITreeSettings<Datum>) {
    // create tree generator to which the root (d3 hierarchy data) will be passed
    const treeGenerator = d3
      .tree()
      .nodeSize(params.NODE_SIZE) as d3.TreeLayout<Datum>

    // create hierarchy to be passed to the tree generator
    this.root = d3.hierarchy(data)
    this.tree = treeGenerator(this.root as d3.HierarchyNode<Datum>)

    this.selector = {
      nodes: '.node',
      branches: '.branch',
      rootSvg: settings.rootSvgSelector,
      rootGroup: settings.rootGroupSelector,
    }
    this.nodeBreadths = {}

    this.buildNodes(settings.nodeTextDataKey)
    this.buildBranches()
  }

  get rootGroupSelection() {
    return d3.select(this.selector.rootGroup)
  }

  get nodesSelection() {
    return d3.selectAll<SVGGElement, d3.HierarchyPointNode<Datum>>(
      this.selector.nodes
    )
  }

  get branchesSelection() {
    return d3.selectAll<SVGPathElement, d3.HierarchyPointLink<Datum>>(
      this.selector.branches
    )
  }

  buildNodes(nodeTextDataKey: keyof Datum) {
    this.buildNodeGroup().buildNodeText(nodeTextDataKey).buildNodeLine()
  }

  buildNodeGroup() {
    d3.select(this.selector.rootGroup)
      .selectAll('.node')
      .data(this.tree.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')

    return this
  }

  buildNodeText(dataKey: keyof Datum) {
    this.nodesSelection
      .append('text')
      .text(d => String(d.data[dataKey]))
      .attr('y', d => d.x - 4)
      .attr('x', d => d.y)
      .attr('font-family', params.FONT_FAMILY)
      .attr('font-size', params.FONT_SIZE)
      .attr('transform', `translate(${params.NODE_PADDING}, 0)`)
      .each(this.registerNodeBreadth.bind(this))

    return this
  }

  private registerNodeBreadth(
    d: INode<Datum>,
    i: number,
    elements: SVGTextElement[] | ArrayLike<SVGTextElement>
  ) {
    const textBreadth = Math.ceil(elements[i].getComputedTextLength())
    const fullBreadth = textBreadth + 2 * params.NODE_PADDING

    this.nodeBreadths[d.data.id] =
      fullBreadth <= params.MAX_TEXT_BREADTH
        ? fullBreadth
        : params.MAX_TEXT_BREADTH
  }

  buildNodeLine() {
    this.nodesSelection
      .append('line')
      .attr('y1', d => d.x)
      .attr('x1', d => d.y)
      .attr('y2', d => d.x)
      .attr('x2', d => d.y + this.nodeBreadths[d.data.id])
      .attr('stroke', 'red')

    return this
  }

  buildBranches() {
    this.rootGroupSelection
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
