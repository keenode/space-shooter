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
  facingAngle = 0
  strafeVelX = 0
  strafeVelY = 0
  reverseVelX = 0
  reverseVelY = 0
  accel = 0.5
  strafeAccel = 0.5
  reverseAccel = 0.25
  spd = 0
  maxSpd = 10.0
  strafeSpd = 0
  lastStrafeDir = 0
  lastStrafeSpd = 0
  angle = 0
  maxStrafeSpd = 5.0
  rotAccel = 0.01
  maxRotVel = 0.1
  maxStrafeForce = 5.0
  mass = 0.98
  brakeForce = 0.9
  rotating = {
    left: false,
    right: false
  }
  lateralThrusting = {
    left: false,
    right: false
  }
  isThrusting = false
  isBraking = false
  isReversing = false
  isFiringWeapon = false
  fireTimer = 0
  fireRate = 10.0
  shields = 0.0
  shieldsRegenRate = 0.0
  regenRate = 10.0
  regenTimer = 0

  constructor(data, playRegionBounds) {
    this.shields = data.shields
    this.shieldsRegenRate = data.shieldsRegenRate
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
      // this.isReversing = true
    }

    // Handle key down for rotating
    if (e.which === 65) {
      this.rotating.left = true
    } else if (e.which === 68) {
      this.rotating.right = true
    }

    // Handle key down for lateral thrusting
    if (e.which === 81 || e.which === 37) {
      this.lateralThrusting.left = true
    } else if (e.which === 69 || e.which === 39) {
      this.lateralThrusting.right = true
    }

    // Handle key down for reversing
    // if (e.which === 83) {
    //   this.isReversing = true
    // }

    // Handle key down for firing weapon
    if (e.which === 32) {
      this.isFiringWeapon = true
    }
  }

  handleKeyUp(e) {
    // Handle key up for thursting & braking
    if (e.which === 87 || e.which === 38) {
      this.isThrusting = false
    } else if (e.which === 83 || e.which === 40) {
      this.isBraking = false
      // this.isReversing = false
    }

    // Handle key up for rotating
    if (e.which === 65) {
      this.rotating.left = false
    } else if (e.which === 68) {
      this.rotating.right = false
    }

    // Handle key up for lateral thrusting
    if (e.which === 81 || e.which === 37) {
      this.lateralThrusting.left = false
    } else if (e.which === 69 || e.which === 39) {
      this.lateralThrusting.right = false
    }

    // Handle key up for reversing
    // if (e.which === 83) {
    //   this.isReversing = false
    // }

    // Handle key up for firing weapon
    if (e.which === 32) {
      this.isFiringWeapon = false
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
    this.facingAngle = this.PIXIContainer.rotation * 180 / Math.PI
    // console.log(this.facingAngle)

    // Set magnitude of speed
    this.spd = Math.sqrt(this.vy * this.vy + this.vx * this.vx)
    this.strafeSpd = Math.sqrt(this.strafeVelY * this.strafeVelY + this.strafeVelX * this.strafeVelX)
    // console.log(this.spd)
    // console.log(this.strafeSpd)

    // if (this.spd > this.maxSpd) {
    //   this.spd = this.maxSpd
    // }

    // if (this.strafeSpd > this.maxStrafeSpd) {
    //   this.strafeSpd = this.maxStrafeSpd
    // }

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

    // Handle lateralThrusting forces
    const strafeDir = this.lateralThrusting.right ? 1 : this.lateralThrusting.left ? -1 : 0
    if (strafeDir !== 0 && this.strafeSpd < this.maxStrafeSpd) {
      const strafeForceX = this.strafeAccel * Math.cos(this.PIXIContainer.rotation) * strafeDir
      const strafeForceY = this.strafeAccel * Math.sin(this.PIXIContainer.rotation) * strafeDir
      this.strafeVelX += strafeForceX
      this.strafeVelY += strafeForceY
      this.vx += strafeForceX
      this.vy += strafeForceY
    }

    // Handle braking
    if (this.isBraking) {
      // console.log('isBraking')
      this.vx *= this.brakeForce
      this.vy *= this.brakeForce
      this.rv *= this.brakeForce
      if (this.spd < 0.5) {
        this.isReversing = true
      }
    } else if (this.spd > 0) {
      this.isReversing = false
    }

    // Handle reversing
    if (this.isReversing) {
      // console.log('isReversing')
      const reverseForceX = this.reverseAccel * Math.cos(this.PIXIContainer.rotation - offsetAngle - 180 * Math.PI / 180)
      const reverseForceY = this.reverseAccel * Math.sin(this.PIXIContainer.rotation - offsetAngle - 180 * Math.PI / 180)
      this.reverseVelX += reverseForceX
      this.reverseVelY += reverseForceY
      this.vx += reverseForceX
      this.vy += reverseForceY
    }

    // Handle decceleration from mass
    // if (!this.isThrusting && strafeDir === 0) {
    // if (!this.isThrusting) {
      this.vx *= this.mass
      this.vy *= this.mass
      if (Math.abs(Math.round(this.vx * 100) / 100) <= 0) {
        this.vx = 0
      }
      if (Math.abs(Math.round(this.vy * 100) / 100) <= 0) {
        this.vy = 0
      }
    // }

    // if (strafeDir === 0) {
      this.strafeVelX *= this.mass
      this.strafeVelY *= this.mass
      if (Math.abs(Math.round(this.strafeVelX * 100) / 100) <= 0) {
        this.strafeVelX = 0
      }
      if (Math.abs(Math.round(this.strafeVelY * 100) / 100) <= 0) {
        this.strafeVelY = 0
      }
    // }

    this.reverseVelX *= this.mass
    this.reverseVelY *= this.mass
    if (Math.abs(Math.round(this.reverseVelX * 100) / 100) <= 0) {
      this.reverseVelX = 0
    }
    if (Math.abs(Math.round(this.reverseVelY * 100) / 100) <= 0) {
      this.reverseVelY = 0
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

    // Regen shields
    this.regenTimer += delta

    // Handle firing of weapon timer
    this.fireTimer += delta
  }
}

export default PlayerShip
