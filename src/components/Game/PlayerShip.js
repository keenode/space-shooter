import * as PIXI from 'pixi.js'

class PlayerShip {
  PIXIContainer = new PIXI.Container()

  constructor(playRegionBounds) {
    this.PIXIContainer.x = playRegionBounds.width / 2
    this.PIXIContainer.y = playRegionBounds.height - 72
    this.PIXIContainer.addChild(this.draw())
  }

  draw() {
    const triangle = new PIXI.Graphics()
    triangle.beginFill(0xff0000)
    triangle.lineStyle(1, 0xffffff, 1)
    triangle.drawPolygon([
      -24, 48,
      24, 48,
      0, 0,
      -24, 48
    ])
    triangle.endFill()
    return triangle
  }
}

export default PlayerShip
