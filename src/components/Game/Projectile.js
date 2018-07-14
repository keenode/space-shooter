import * as PIXI from 'pixi.js'
import PlayerShip from './PlayerShip'

const offsetAngle = 90 * Math.PI / 180

class Projectile {
  PIXIContainer = new PIXI.Container()
  parentRotation = 0
  vx = 0
  vy = 0
  accel = 10.0
  speed = 0
  speedMax = 22.0
  parentSpeed = 0
  lifeTime = 0
  lifeTimeMax = 200.0
  isAlive = true

  constructor(parentEntity) {
    this.parentRotation = parentEntity.PIXIContainer.rotation
    this.parentSpeed = parentEntity.data.speed
    this.PIXIContainer.x = parentEntity.PIXIContainer.x
    this.PIXIContainer.y = parentEntity.PIXIContainer.y

    const spriteContainer = new PIXI.Container()
    const projectileSprite = new PIXI.Sprite(
      PIXI.loader.resources['assets/images/projectiles/projectile.png'].texture
    )
    projectileSprite.width = projectileSprite.width / 2
    projectileSprite.height = projectileSprite.height / 2
    projectileSprite.x = -projectileSprite.width / 2
    projectileSprite.y = -projectileSprite.height / 2
    projectileSprite.tint = parentEntity instanceof PlayerShip ? 0x00ff42 : 0xff0030
    spriteContainer.rotation = this.parentRotation
    spriteContainer.addChild(projectileSprite)
    this.PIXIContainer.addChild(spriteContainer)
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
