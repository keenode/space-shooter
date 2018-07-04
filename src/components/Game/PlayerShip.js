import * as PIXI from 'pixi.js'

const shipWidth = 48
const shipHeight = 48
const shipBottomPadding = 24
const offsetAngle = 90 * Math.PI / 180

class PlayerShip {
  PIXIContainer = new PIXI.Container()
  playRegionBounds = null
  vx = 0
  vy = 0
  rv = 0
  accel = 2.0
  spd = 0
  rotSpd = 0
  rotAccel = 0.01
  maxRotVel = 0.1
  maxSpd = 10.0
  mass = 0.15
  // rotDeccel = 0.35
  // deccel = 0.35
  rotating = {
    left: false,
    right: false
  }
  isThrusting = false
  isBraking = false
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
    if (e.which === 87 || e.which === 38) {
      this.isThrusting = true
    } else if (e.which === 83 || e.which === 40) { 
      this.isBraking = true
    }

    if (e.which === 65 || e.which === 37) {
      this.rotating.left = true
    } else if (e.which === 68 || e.which === 39) {
      this.rotating.right = true
    }

    if (e.which === 32) {
      this.isFiring = true
    }
  }

  handleKeyUp(e) {
    if (e.which === 87 || e.which === 38) {
      this.isThrusting = false
    } else if (e.which === 83 || e.which === 40) { 
      this.isBraking = false
    }
    
    if (e.which === 37 || e.which === 65) {
      this.rotating.left = false
    } else if (e.which === 39 || e.which === 68) {
      this.rotating.right = false
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
    // Set magnitude of speed
    this.spd = Math.sqrt(this.vy * this.vy + this.vx * this.vx)

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
    // if (this.isBraking) {
    //   this.vy += this.spd
    // }

    // Get angle of velocity
    // var angle = Math.atan2(velocity.y, velocity.x);

    // Handle decceleration from mass
    this.vx -= this.mass * Math.sign(this.vx)
    this.vy -= this.mass * Math.sign(this.vy)
    if (rotDir === 0) {
      this.rv -= this.mass * Math.sign(this.rv) / 40.0
      if (this.rv < 0) {
        this.rv = 0
      }
    }

    // Handle max velocity
    console.log(this.rv)

    // this.vx = Math.abs(this.vx) > this.maxSpd ? this.maxSpd : this.vx
    // this.vy = Math.abs(this.vy) > this.maxSpd ? this.maxSpd : this.vy
    // this.rv = Math.abs(this.rv) > this.maxRotVel ? this.maxRotVel * rotDir : this.rv

    // Bounds checking
    // if (this.PIXIContainer.x + this.vx < 0) {
    //   this.vx = 0
    //   this.PIXIContainer.x = 0
    // } else if (this.PIXIContainer.x + this.vx > this.playRegionBounds.width) {
    //   this.vx = 0
    //   this.PIXIContainer.x = this.playRegionBounds.width
    // } else {
      // Update position
      this.PIXIContainer.rotation += this.rv * delta
      this.PIXIContainer.x += Math.round(this.vx) * delta
      this.PIXIContainer.y += Math.round(this.vy) * delta
    // }

    this.fireTimer += delta
  }
}

export default PlayerShip
