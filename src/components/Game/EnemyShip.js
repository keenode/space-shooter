import * as PIXI from 'pixi.js'

const shipWidth = 48
const shipHeight = 48
const offsetAngle = 90 * Math.PI / 180

class EnemyShip {
  PIXIContainer = new PIXI.Container()
  playRegionBounds = null
  vx = 0
  vy = 0
  rv = 0
  accel = 2.0
  spd = 0
  maxSpd = 1.0
  rotAccel = 0.005
  maxRotVel = 0.05
  mass = 0.98
  brakeForce = 0.9
  rotating = {
    left: false,
    right: false
  }
  isThrusting = false
  isAlive = true
  nextAttackElapsed = 0
  nextAttackTimer = Math.random() * 175.0 + 25.0
  aiTimeElasped = 0
  aiNextActionTime = Math.random() * 175.0 + 25.0

  data = {}

  constructor(xPos, yPos, playRegionBounds) {
    this.playRegionBounds = playRegionBounds
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
    // Set magnitude of speed
    this.spd = Math.sqrt(this.vy * this.vy + this.vx * this.vx)
    this.data.speed = this.spd

    // Handle rotational acceleration and velocity
    const rotDir = this.rotating.right ? 1 : this.rotating.left ? -1 : 0
    if (Math.abs(this.rv) < this.maxRotVel) {
      this.rv += this.rotAccel * rotDir
    }

    // Handle thrusting acceleration and velocity
    if (this.isThrusting && this.spd < this.maxSpd) {
      this.vx += this.accel * Math.cos(this.PIXIContainer.rotation - offsetAngle)
      this.vy += this.accel * Math.sin(this.PIXIContainer.rotation - offsetAngle)
    }

    // Handle braking
    if (this.isBraking) {
      this.vx *= this.brakeForce
      this.vy *= this.brakeForce
      this.rv *= this.brakeForce
    }

    // Handle decceleration from mass
    if (!this.isThrusting) {
      this.vx *= this.mass
      this.vy *= this.mass
      if (Math.abs(Math.round(this.vx * 100) / 100) <= 0) {
        this.vx = 0
      }
      if (Math.abs(Math.round(this.vy * 100) / 100) <= 0) {
        this.vy = 0
      }
    }

    if (rotDir === 0) {
      this.rv *= this.mass * 0.8
      if (Math.abs(Math.round(this.rv * 100) / 100) <= 0) {
        this.rv = 0
      }
    }

    // Bounds checking
    if (this.PIXIContainer.x + this.vx < 0) {
      this.vx = 0
      this.vy = 0
      this.PIXIContainer.x = 0
    } else if (this.PIXIContainer.x + this.vx > this.playRegionBounds.width) {
      this.vx = 0
      this.vy = 0
      this.PIXIContainer.x = this.playRegionBounds.width
    } else if (this.PIXIContainer.y + this.vy < 0) {
      this.vx = 0
      this.vy = 0
      this.PIXIContainer.y = 0
    } else if (this.PIXIContainer.y + this.vy > this.playRegionBounds.height) {
      this.vx = 0
      this.vy = 0
      this.PIXIContainer.y = this.playRegionBounds.height
    } else {
      // Update position
      this.PIXIContainer.rotation += this.rv * delta
      this.PIXIContainer.x += this.vx * delta
      this.PIXIContainer.y += this.vy * delta
    }

    // TEMP: Dumb AI
    if (this.aiTimeElasped >= this.aiNextActionTime) {
      const actionRange = Math.floor(Math.random() * 100)
      if (actionRange >= 95) {
        this.rotating.left = false
        this.rotating.right = true
      } else if (actionRange >= 90) {
        this.rotating.right = false
        this.rotating.left = true
      } else if (actionRange >= 85) {
        this.isBraking = true
      } else if (actionRange >= 80) {
        this.isBraking = false
      } else if (actionRange >= 40) {
        this.rotating.right = false
        this.rotating.left = false
      } else if (actionRange >= 20) {
        this.isThrusting = false
      } else {
        this.isThrusting = true
      }
      this.aiTimeElasped = 0
      this.aiNextActionTime = Math.random() * 95.0 + 5.0
    }

    this.nextAttackElapsed += delta
    this.aiTimeElasped  += delta
  }
}

export default EnemyShip
