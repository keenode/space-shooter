import * as PIXI from 'pixi.js'

import gfxConfig from '../../config/graphics'

const numStars = 2048
const starColors = [
  0xffffff,
  0xffbcc4,
  0xbaf8ff,
  0xfec7ff,
  0xfff4d9
]

class StarFieldAmbientBG {
  PIXIContainer = new PIXI.Container()
  sceneBounds = null

  constructor(sceneBounds, depth = 1) {
    this.sceneBounds = sceneBounds
    this.depth = depth
    this.PIXIContainer.addChild(this.draw())
    if (gfxConfig.blur) {
      this.addFiltersFX()
    }
  }

  addFiltersFX() {
    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 0.5
    this.PIXIContainer.filters = [blurFilter]
  }

  draw() {
    const circle = new PIXI.Graphics()
    for (let i = 0; i < numStars; i++) {
      const color = starColors[Math.floor(Math.random() * starColors.length)]
      const xPos = Math.floor(Math.random() * this.sceneBounds.width)
      const yPos = Math.floor(Math.random() * this.sceneBounds.height)
      let radius = Math.round((Math.random() * 4 * 100) / this.depth) / 100
      const alpha = Math.round(Math.random() * 1 * 100) / 100
      if (radius < 1) {
        radius = 1
      }
      circle.beginFill(color, alpha)
      circle.drawCircle(xPos, yPos, radius)
      circle.endFill()
    }
    return circle
  }
}

export default StarFieldAmbientBG
