import * as d3 from 'd3'

import { Builder, ISettings } from './types'

class Settings {
  height = '100%'
  width = '100%'
  id = 'root-svg'
  padding = 25
  rootDivSelector = '#root'
  rootSvgSelector = `#${this.id}`
  rootGroupSelector = this.rootSvgSelector + ' g'

  constructor(overrides?: Partial<ISettings>) {
    Object.assign(this, overrides)
  }

  get rootSvgRect() {
    return document
      .querySelector(this.rootSvgSelector)
      ?.getBoundingClientRect() as DOMRect
  }

  get rootGroupRect() {
    return document
      .querySelector(this.rootGroupSelector)
      ?.getBoundingClientRect() as DOMRect
  }

  get rootSvgOrigin() {
    const { x, y } = this.rootSvgRect
    return { x: x + this.padding, y: y + this.padding }
  }

  get rootGroupOrigin() {
    const { x, y } = this.rootGroupRect
    return { x: x + this.padding, y: y + this.padding }
}

  get rootGroupInnerRect() {
    const { width, height } = this.rootSvgRect
    return {
      width: width - 2 * this.padding,
      height: height - 2 * this.padding,
    }
  }
}

export default function useD3(builder: Builder, settingOverrides?: ISettings) {
  const settings = new Settings(settingOverrides)

  function initSvg() {
    d3.select(settings.rootDivSelector)
      .append('svg')
      .attr('id', settings.id)
      .attr('width', settings.width)
      .attr('height', settings.height)

      .append('g')
      .attr('transform', `translate(${settings.padding}, ${settings.padding})`)
  }

  function build() {
    initSvg()
    builder(settings)
  }

  function unmout() {
    d3.select(settings.rootSvgSelector).remove()
  }

  return {
    build,
    unmout,
    settings,
  }
}
