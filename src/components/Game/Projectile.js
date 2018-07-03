import * as PIXI from 'pixi.js'

class Projectile {
  PIXIContainer = new PIXI.Container()
  playRegionBounds = null
  vx = 0
  vy = 0
  accel = 1.0
  maxVel = 10.0
  friction = 0.35
  isAlive = true
  // force = mass * accel

  constructor(xPos, yPos, playRegionBounds) {
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
    this.vy -= this.accel
    this.vy -= this.friction * Math.sign(this.vy)
    this.vy = Math.abs(this.vy) > this.maxVel ? -this.maxVel : this.vy

    if (this.PIXIContainer.y + this.vy < 0) {
      this.isAlive = false
    }

    this.PIXIContainer.y += Math.round(this.vy) * delta
  }
}

export default Projectile
