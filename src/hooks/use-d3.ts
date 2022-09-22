import * as d3 from 'd3'

import { Builder, ISettings } from '../types'

class Settings {
  height = 500
  id = 'root-svg'
  padding = 25
  rootSelector = '#root'
  width = 500

  constructor(overrides?: Partial<ISettings>) {
    Object.assign(this, overrides)
  }

  get contentSelector() {
    return `#${this.id} g`
  }
  get innerHeight() {
    return this.height - 2 * this.padding
  }
  get innerWidth() {
    return this.width - 2 * this.padding
  }
}

export default function useD3(
  builder: Builder,
  settingOverrides?: Partial<ISettings>
) {
  const settings = new Settings(settingOverrides)

  function generate() {
    return d3
      .select(settings.rootSelector)
      .append('svg')
      .attr('id', settings.id)
      .attr('width', settings.width)
      .attr('height', settings.height)

      .append('g')
      .attr('transform', `translate(${settings.padding}, ${settings.padding})`)
  }

  function build() {
    const svg = generate()
    builder(svg, settings)
  }

  function unmout() {
    d3.select(`#${settings.id}`).remove()
  }

  return {
    build,
    generate,
    settings,
    unmout,
  }
}
