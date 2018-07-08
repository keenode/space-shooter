import * as PIXI from 'pixi.js'

const offsetAngle = 90 * Math.PI / 180

class Projectile {
  PIXIContainer = new PIXI.Container()
  parentAngle = 0
  vx = 0
  vy = 0
  accel = 4.0
  spd = 0
  maxSpd = 20.0
  parentSpd = 0.0
  lifeTime = 0
  maxLifeTime = 200.0
  isAlive = true

  constructor(parentEntity) {
    this.parentAngle = parentEntity.PIXIContainer.rotation
    this.parentSpd = parentEntity.spd
    this.PIXIContainer.x = parentEntity.PIXIContainer.x
    this.PIXIContainer.y = parentEntity.PIXIContainer.y
    const projectileShape = this.draw()
    this.PIXIContainer.addChild(projectileShape)
    this.addFiltersFX(projectileShape)
  }

  addFiltersFX(projectileShape) {
    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 1
    projectileShape.filters = [blurFilter]
    const blurFxInner = this.draw(5, 0x00ffff)
    const blurFilterInner = new PIXI.filters.BlurFilter()
    blurFilterInner.blur = 8
    blurFilterInner.resolution = 4
    blurFxInner.filters = [blurFilterInner]
    this.PIXIContainer.addChild(blurFxInner)
    const blurFxOuter = this.draw(6)
    const blurFilterOuter = new PIXI.filters.BlurFilter()
    blurFilterOuter.blur = 16
    blurFilterOuter.resolution = 8
    blurFxOuter.filters = [blurFilterOuter]
    this.PIXIContainer.addChild(blurFxOuter)
  }

  draw(radius = 4, color = 0xffff00) {
    const circle = new PIXI.Graphics()
    circle.beginFill(color)
    circle.drawCircle(0, 0, radius)
    circle.endFill()
    return circle
  }

  update(delta) {
    // Set magnitude of speed
    this.spd = Math.sqrt(this.vy * this.vy + this.vx * this.vx)
    // Handle acceleration and velocity
    if (this.spd < this.maxSpd + this.parentSpd) {
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
