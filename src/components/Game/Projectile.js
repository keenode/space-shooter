import * as PIXI from 'pixi.js'

class Projectile {
  PIXIContainer = new PIXI.Container()
  vx = 0
  vy = 0
  accel = 0.8
  maxVel = 20.0
  friction = 0.35

  constructor(xPos, yPos) {
    this.PIXIContainer.x = xPos
    this.PIXIContainer.y = yPos
    this.PIXIContainer.addChild(this.draw())
  }

  draw() {
    const circle = new PIXI.Graphics()
    circle.beginFill(0x00ffff)
    circle.drawCircle(0, 0, 4)
    circle.endFill()
    return circle
  }

  update(delta) {
    
  }
}

export default Projectile
