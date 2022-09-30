import { Builder } from '~/hooks/types'

import data from './data/tree-data'
import { Tree } from './Tree'
import { ITreeSettings } from './types'

export interface Person {
  id: string
  name: string
}

const builder: Builder = ({ rootSvgSelector, rootGroupSelector }) => {
  const treeSettings: ITreeSettings<Person> = {
    rootSvgSelector,
    rootGroupSelector,
    nodeTextDataKey: 'name',
  }

  new Tree<Person>(data, treeSettings)
}

export default builder
