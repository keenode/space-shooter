import * as PIXI from 'pixi.js'

class PlayerShip {
  PIXIContainer = new PIXI.Container()
  vx = 0
  vy = 0
  accel = 0.8
  maxVel = 20.0
  friction = 0.35
  moving = {
    left: false,
    right: false
  }

  constructor(playRegionBounds) {
    this.PIXIContainer.x = playRegionBounds.width / 2
    this.PIXIContainer.y = playRegionBounds.height - 72
    this.PIXIContainer.addChild(this.draw())
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  handleKeyDown(e) {
    if (e.which === 37 || e.which === 65) {
      this.moving.left = true
    } else if (e.which === 39 || e.which === 68) {
      this.moving.right = true
    }
  }

  handleKeyUp(e) {
    if (e.which === 37 || e.which === 65) {
      this.moving.left = false
    } else if (e.which === 39 || e.which === 68) {
      this.moving.right = false
    }
  }

  draw() {
    const triangle = new PIXI.Graphics()
    triangle.beginFill(0xff0000)
    triangle.lineStyle(1, 0xffffff, 1)
    triangle.drawPolygon([
      -24, 48,
      24, 48,
      0, 0,
      -24, 48
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

    // console.log('vy: ' + this.vy)
    // console.log('vx: ' + this.vx)

    // Set position
    this.PIXIContainer.x += Math.round(this.vx) * delta
    this.PIXIContainer.y += Math.round(this.vy) * delta
  }
}

export default PlayerShip
