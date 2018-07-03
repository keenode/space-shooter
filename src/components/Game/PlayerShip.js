import * as PIXI from 'pixi.js'

const shipWidth = 48
const shipHeight = 48
const shipBottomPadding = 24

class PlayerShip {
  PIXIContainer = new PIXI.Container()
  playRegionBounds = null
  vx = 0
  vy = 0
  accel = 0.8
  maxVel = 20.0
  friction = 0.35
  moving = {
    left: false,
    right: false
  }
  isFiring = false
  fireTimer = 0
  fireRate = 10.0

  constructor(playRegionBounds) {
    this.playRegionBounds = playRegionBounds
    this.PIXIContainer.x = playRegionBounds.width / 2
    this.PIXIContainer.y = playRegionBounds.height - shipHeight / 2 - shipBottomPadding
    this.PIXIContainer.addChild(this.draw())
    this.fireTimer = this.fireRate
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  handleKeyDown(e) {
    if (e.which === 37 || e.which === 65) {
      this.moving.left = true
    } else if (e.which === 39 || e.which === 68) {
      this.moving.right = true
    }

    if (e.which === 32) {
      this.isFiring = true
    }
  }

  handleKeyUp(e) {
    if (e.which === 37 || e.which === 65) {
      this.moving.left = false
    } else if (e.which === 39 || e.which === 68) {
      this.moving.right = false
    }

    if (e.which === 32) {
      this.isFiring = false
    }
  }

  draw() {
    const triangle = new PIXI.Graphics()
    triangle.beginFill(0xff0000)
    triangle.lineStyle(1, 0xffffff, 1)
    triangle.drawPolygon([
      -shipWidth / 2, shipHeight / 2,
      shipWidth / 2, shipHeight / 2,
      0, -shipHeight / 2,
      -shipWidth / 2, shipHeight / 2
    ])
    triangle.endFill()
    return triangle
  }

  update(delta) {
    // Handle acceleration direction
    // if (this.moving.up) {
    //   this.vy += this.accel
    // }
    // if (this.moving.down) {
    //   this.vy -= this.accel
    // }
    if (this.moving.left) {
      this.vx -= this.accel
    }
    if (this.moving.right) {
      this.vx += this.accel
    }

    // Handle friction
    this.vx -= this.friction * Math.sign(this.vx)
    this.vy -= this.friction * Math.sign(this.vy)

    // Handle max velocity 
    const dirFactorX = this.moving.left ? -1 : 1
    const dirFactorY = this.moving.up ? 1 : -1
    this.vx = Math.abs(this.vx) > this.maxVel ? this.maxVel * dirFactorX : this.vx
    this.vy = Math.abs(this.vy) > this.maxVel ? this.maxVel * dirFactorY : this.vy

    // Bounds checking
    if (this.PIXIContainer.x + this.vx < 0) {
      this.vx = 0
      this.PIXIContainer.x = 0
    } else if (this.PIXIContainer.x + this.vx > this.playRegionBounds.width) {
      this.vx = 0
      this.PIXIContainer.x = this.playRegionBounds.width
    } else {
      // Update position
      this.PIXIContainer.x += Math.round(this.vx) * delta
      this.PIXIContainer.y += Math.round(this.vy) * delta
    }

    this.fireTimer += delta
  }
}

export default PlayerShip
