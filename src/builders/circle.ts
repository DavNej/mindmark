import { Builder } from '../types'

const builder: Builder = (svg, settings) => {
  svg.append('circle').attr('cx', 50).attr('cy', 50).attr('r', 50)
}

export default builder
