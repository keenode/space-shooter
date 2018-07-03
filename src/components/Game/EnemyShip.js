import * as PIXI from 'pixi.js'

const shipWidth = 48
const shipHeight = 48

class EnemyShip {
  PIXIContainer = new PIXI.Container()
  vx = 0
  vy = 0
  accel = 0.8
  maxVel = 1.0
  friction = 0.35
  // isFiring = false
  // fireTimer = 0
  // fireRate = 10.0
  isAlive = true
  nextAttackElapsed = 0
  nextAttackTimer = Math.random() * 175.0 + 25.0

  constructor(xPos, yPos) {
    this.PIXIContainer.x = xPos
    this.PIXIContainer.y = yPos
    this.PIXIContainer.rotation = 180 * Math.PI / 180
    this.PIXIContainer.addChild(this.draw())
    // this.fireTimer = this.fireRate
  }

  draw() {
    const triangle = new PIXI.Graphics()
    triangle.beginFill(0xffffff)
    triangle.lineStyle(1, 0xff0000, 1)
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
    // if (this.moving.left) {
    //   this.vx -= this.accel
    // }
    // if (this.moving.right) {
    //   this.vx += this.accel
    // }
    this.vy += this.accel

    // Handle friction
    this.vx -= this.friction * Math.sign(this.vx)
    this.vy -= this.friction * Math.sign(this.vy)

    // Handle max velocity 
    const dirFactorX = 1 //this.moving.left ? -1 : 1
    const dirFactorY = 1 //this.moving.up ? 1 : -1
    this.vx = Math.abs(this.vx) > this.maxVel ? this.maxVel * dirFactorX : this.vx
    this.vy = Math.abs(this.vy) > this.maxVel ? this.maxVel * dirFactorY : this.vy

    // Update position
    this.PIXIContainer.x += Math.round(this.vx) * delta
    this.PIXIContainer.y += Math.round(this.vy) * delta

    this.nextAttackElapsed += delta
  }
}

export default EnemyShip
