import * as PIXI from 'pixi.js'

const offsetAngle = 90 * Math.PI / 180

class Projectile {
  PIXIContainer = new PIXI.Container()
  projectileContainer = new PIXI.Container()
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
    this.projectileContainer.rotation = this.parentAngle
    const projectileShape = this.draw()
    this.projectileContainer.addChild(projectileShape)
    this.addFiltersFX(projectileShape)
    this.PIXIContainer.addChild(this.projectileContainer)
  }

  addFiltersFX(projectileShape) {
    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 1
    projectileShape.filters = [blurFilter]
    const blurFxInner = this.draw(2)
    const blurFilterInner = new PIXI.filters.BlurFilter()
    blurFilterInner.blur = 4
    blurFxInner.filters = [blurFilterInner]
    this.projectileContainer.addChild(blurFxInner)
    const blurFxOuter = this.draw(4, 0xffff00)
    const blurFilterOuter = new PIXI.filters.BlurFilter()
    blurFilterOuter.blur = 12
    blurFilterOuter.resolution = 4
    blurFxOuter.filters = [blurFilterOuter]
    blurFxOuter.alpha = 0.5
    this.projectileContainer.addChild(blurFxOuter)
  }

  draw(size = 2, color = 0x00ff00) {
    const ellipse = new PIXI.Graphics()
    ellipse.beginFill(color)
    ellipse.drawEllipse(0, 0, size, size * 5)
    ellipse.endFill()
    return ellipse
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
