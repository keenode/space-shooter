import * as PIXI from 'pixi.js'

class PlayerShip {
  PIXIContainer = new PIXI.Container()

  constructor(xPos, yPos) {
    this.PIXIContainer.x = xPos
    this.PIXIContainer.y = yPos
    this.PIXIContainer.addChild(this.draw())
  }

  draw() {
    const triangle = new PIXI.Graphics()
    triangle.beginFill(0xff0000)
    triangle.lineStyle(1, 0xffffff, 1)
    triangle.drawPolygon([
      -32, 64,
      32, 64,
      0, 0,
      -32, 64
    ])
    triangle.endFill()
    return triangle
  }
}

export default PlayerShip
