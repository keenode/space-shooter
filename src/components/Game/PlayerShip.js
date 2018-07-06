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
  strafeForceX = 0
  strafeForceY = 0
  accel = 2.0
  spd = 0
  strafeFactor = 0.25
  angle = 0
  maxSpd = 10.0
  rotAccel = 0.01
  maxRotVel = 0.1
  maxStrafeForce = 5.0
  mass = 0.98
  brakeForce = 0.9
  rotating = {
    left: false,
    right: false
  }
  strafing = {
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
    // console.log(e.which)
    // Handle key down for thursting & braking
    if (e.which === 87 || e.which === 38) {
      this.isThrusting = true
    } else if (e.which === 83 || e.which === 40) {
      this.isBraking = true
    }

    // Handle key down for rotating
    if (e.which === 65 || e.which === 37) {
      this.rotating.left = true
    } else if (e.which === 68 || e.which === 39) {
      this.rotating.right = true
    }

    // Handle key down for strafing
    if (e.which === 81) {
      this.strafing.left = true
    } else if (e.which === 69) {
      this.strafing.right = true
    }

    // Handle key down for firing weapon
    if (e.which === 32) {
      this.isFiring = true
    }
  }

  handleKeyUp(e) {
    // Handle key up for thursting & braking
    if (e.which === 87 || e.which === 38) {
      this.isThrusting = false
    } else if (e.which === 83 || e.which === 40) {
      this.isBraking = false
    }

    // Handle key up for rotating
    if (e.which === 37 || e.which === 65) {
      this.rotating.left = false
    } else if (e.which === 39 || e.which === 68) {
      this.rotating.right = false
    }

    // Handle key up for strafing
    if (e.which === 81) {
      this.strafing.left = false
    } else if (e.which === 69) {
      this.strafing.right = false
    }

    // Handle key up for firing weapon
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
    // Get angle of velocity
    // var angle = Math.atan2(this.vy, this.vx)
    this.facingAngle = this.PIXIContainer.rotation
    // console.log(this.facingAngle)

    // Set magnitude of speed
    this.spd = Math.sqrt(this.vy * this.vy + this.vx * this.vx)
    // this.strafeSpd = Math.sqrt(this.strafeForceY * this.strafeForceY + this.strafeForceX * this.strafeForceX)

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

    // Handle strafing forces
    const strafeDir = this.strafing.right ? 1 : this.strafing.left ? -1 : 0

    if (this.spd < this.maxSpd * this.strafeFactor) {
      this.strafeForceX = this.accel * this.strafeFactor * Math.cos(this.PIXIContainer.rotation) * strafeDir
      this.strafeForceY = this.accel * this.strafeFactor * Math.sin(this.PIXIContainer.rotation) * strafeDir
    } else {
      this.strafeForceX = 0
      this.strafeForceY = 0
    }

    // Update total velocity with strafe velocity
    this.vx += this.strafeForceX
    this.vy += this.strafeForceY

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

    // if (strafeDir === 0) {
    //   this.strafeForceX *= this.mass
    //   this.strafeForceY *= this.mass
    //   if (Math.abs(Math.round(this.strafeForceX * 100) / 100) <= 0) {
    //     this.strafeForceX = 0
    //   }
    //   if (Math.abs(Math.round(this.strafeForceY * 100) / 100) <= 0) {
    //     this.strafeForceY = 0
    //   }
    // }

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

    this.fireTimer += delta
  }
}

export default PlayerShip
