import { Builder } from '../../types'
import data from '../data/tree-data'
import { Tree } from './Tree'

export interface Person {
  id: string
  name: string
}

const builder: Builder = (svg, settings) => {
  new Tree<Person>(svg, data, { nodeTextDataKey: 'name' })

  svg.attr('transform', 'translate(40, 600)')
}

export default builder
