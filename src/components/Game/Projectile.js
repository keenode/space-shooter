import * as PIXI from 'pixi.js'

import gfxConfig from '../../config/graphics'

const offsetAngle = 90 * Math.PI / 180

class Projectile {
  PIXIContainer = new PIXI.Container()
  projectileContainer = new PIXI.Container()
  parentRotation = 0
  vx = 0
  vy = 0
  accel = 4.0
  speed = 0
  speedMax = 20.0
  parentSpeed = 0
  lifeTime = 0
  lifeTimeMax = 200.0
  isAlive = true

  constructor(parentEntity) {
    this.parentRotation = parentEntity.PIXIContainer.rotation
    this.parentSpeed = parentEntity.data.speed
    this.PIXIContainer.x = parentEntity.PIXIContainer.x
    this.PIXIContainer.y = parentEntity.PIXIContainer.y
    this.projectileContainer.rotation = this.parentRotation
    const projectileShape = this.draw()
    this.projectileContainer.addChild(projectileShape)
    if (gfxConfig.blur) {
      this.addFiltersFX(projectileShape)
    }
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
    // Determine magnitude of speed
    this.speed = Math.sqrt(this.vy * this.vy + this.vx * this.vx)

    // Handle acceleration and velocity
    if (this.speed < this.speedMax + this.parentSpeed) {
      this.vx += this.accel * Math.cos(this.PIXIContainer.rotation + this.parentRotation - offsetAngle)
      this.vy += this.accel * Math.sin(this.PIXIContainer.rotation + this.parentRotation - offsetAngle)
    }

    if (this.lifeTime >= this.lifeTimeMax) {
      this.isAlive = false
    }

    this.PIXIContainer.x += Math.round(this.vx) * delta
    this.PIXIContainer.y += Math.round(this.vy) * delta

    this.lifeTime += delta
  }
}

export default Projectile
