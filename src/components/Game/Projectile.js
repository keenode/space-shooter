import * as PIXI from 'pixi.js'
import EnemyShip from './EnemyShip'

class Projectile {
  PIXIContainer = new PIXI.Container()
  playRegionBounds = null
  vx = 0
  vy = 0
  dirFactor = -1
  accel = 1.0
  maxVel = 10.0
  friction = 0.35
  isAlive = true
  // force = mass * accel

  constructor(parentEntity, playRegionBounds) {
    this.playRegionBounds = playRegionBounds
    this.PIXIContainer.x = parentEntity.PIXIContainer.x
    this.PIXIContainer.y = parentEntity.PIXIContainer.y
    this.PIXIContainer.addChild(this.draw())
    if (parentEntity instanceof EnemyShip) {
      this.dirFactor = 1
    }
  }

  draw() {
    const circle = new PIXI.Graphics()
    circle.beginFill(0x00ffff)
    circle.drawCircle(0, 0, 4)
    circle.endFill()
    return circle
  }

  update(delta) {
    if (this.dirFactor === 1) {
      this.vy += this.accel
    } else {
      this.vy -= this.accel
    }
    this.vy -= this.friction * Math.sign(this.vy)
    this.vy = Math.abs(this.vy) > this.maxVel ? this.maxVel * this.dirFactor : this.vy

    if (this.PIXIContainer.y + this.vy < 0) {
      this.isAlive = false
    } else if (this.PIXIContainer.y + this.vy > this.playRegionBounds.height) {
      this.isAlive = false
    }

    this.PIXIContainer.y += Math.round(this.vy) * delta
  }
}

export default Projectile
