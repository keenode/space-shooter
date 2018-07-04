import * as PIXI from 'pixi.js'

const offsetAngle = 90 * Math.PI / 180

class Projectile {
  PIXIContainer = new PIXI.Container()
  parentAngle = 0
  vx = 0
  vy = 0
  accel = 2.0
  spd = 0
  maxSpd = 12.0
  lifeTime = 0
  maxLifeTime = 100.0
  isAlive = true

  constructor(parentEntity) {
    this.parentAngle = parentEntity.PIXIContainer.rotation
    this.PIXIContainer.x = parentEntity.PIXIContainer.x
    this.PIXIContainer.y = parentEntity.PIXIContainer.y
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
    // Set magnitude of speed
    this.spd = Math.sqrt(this.vy * this.vy + this.vx * this.vx)

    // Handle acceleration and velocity
    if (this.spd < this.maxSpd) {
      this.vx += this.accel * Math.cos(this.PIXIContainer.rotation + this.parentAngle - offsetAngle)
      this.vy += this.accel * Math.sin(this.PIXIContainer.rotation + this.parentAngle - offsetAngle)
    }

    if (this.lifeTime >= this.maxLifeTime) {
      this.isAlive = false
    }

    this.PIXIContainer.x += Math.round(this.vx) * delta
    this.PIXIContainer.y += Math.round(this.vy) * delta

    this.lifeTime += delta
  }
}

export default Projectile
