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
  }

  function initZoom() {
    function handleZoom(e: d3.D3ZoomEvent<SVGElement, unknown>) {
      d3.select(settings.rootGroupSelector).attr(
        'transform',
        e.transform.toString()
      )
    }

    const zoom = d3.zoom().on('zoom', handleZoom)

    const scaleFactorX =
      (settings.rootSvgRect.width - 2 * settings.padding) /
      settings.rootGroupRect.width

    const scaleFactorY =
      (settings.rootSvgRect.height - 2 * settings.padding) /
      settings.rootGroupRect.height

    const scaleFactor = Math.min(scaleFactorX, scaleFactorY)

    const translateX = settings.padding
    const translateY = settings.rootSvgRect.height / 2 + settings.padding

    const initialZoom = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(scaleFactor)

    d3.select(settings.rootSvgSelector)
      /**
       * @todo remove any
       */
      .call(zoom.transform as any, initialZoom)
      .call(zoom as any)
  }

  function build() {
    initSvg()
    builder(settings)
    initZoom()
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
