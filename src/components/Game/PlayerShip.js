import * as PIXI from 'pixi.js'

const shipWidth = 48
const shipHeight = 48
const shipBottomPadding = 24
const offsetAngle = 90 * Math.PI / 180

class PlayerShip {
  PIXIContainer = new PIXI.Container()
  gfxThrusting = new PIXI.Container()
  gfxLateralThrustingLeft = new PIXI.Container()
  gfxLateralThrustingRight = new PIXI.Container()
  gfxBraking = new PIXI.Container()
  gfxReversing = new PIXI.Container()
  sceneBounds = null

  // vx = 0
  // vy = 0
  // rv = 0
  // lateralThrustVelX = 0
  // lateralThrustVelY = 0
  // reverseVelX = 0
  // reverseVelY = 0
  // accel = 0.5
  // lateralThrustAccel = 0.5
  // reverseAccel = 0.25
  // spd = 0
  // maxSpd = 10.0
  // maxLateralThrustSpd = 5.0
  // rotAccel = 0.01
  // maxRotVel = 0.1
  // mass = 0.98
  // brakeForce = 0.9
  // isThrusting = false
  // isBraking = false
  // isReversing = false
  // isFiringWeapon = false
  // fireRate = 10.0
  // shields = 0.0
  // shieldsRegenRate = 0
  // energyRegenRate = 0
  // fuel = 0.0
  // isAlive = true

  // Internal vars
  rotating = {
    left: false,
    right: false
  }
  // lateralThrusting = {
  //   left: false,
  //   right: false
  // }
  isLateralThrustingLeft = false
  isLateralThrustingRight = false
  facingAngle = 0
  lateralThrustSpd = 0
  shieldsRegenTimer = 0
  energyRegenTimer = 0
  fireTimer = 0
  shieldsRegenIsReady = true
  shieldsRegenReadyTime = 100.0
  shieldsRegenReadyTimer = 0

  data = null

  constructor(props, sceneBounds) {
    this.data = props
    this.sceneBounds = sceneBounds
    this.PIXIContainer.x = sceneBounds.width / 2
    this.PIXIContainer.y = sceneBounds.height - shipHeight / 2 - shipBottomPadding
    this.gfxThrusting.addChild(this.drawThrustingForce(180))
    this.gfxThrusting.position.y = 47
    this.gfxThrusting.visible = false
    this.PIXIContainer.addChild(this.gfxThrusting)
    this.gfxLateralThrustingLeft.addChild(this.drawThrustingForce(-90, 0.3))
    this.gfxLateralThrustingLeft.position.x = -35
    this.gfxLateralThrustingLeft.visible = false
    this.PIXIContainer.addChild(this.gfxLateralThrustingLeft)
    this.gfxLateralThrustingRight.addChild(this.drawThrustingForce(90, 0.3))
    this.gfxLateralThrustingRight.position.x = 35
    this.gfxLateralThrustingRight.visible = false
    this.PIXIContainer.addChild(this.gfxLateralThrustingRight)
    this.gfxBraking.addChild(this.drawBrakingForce())
    this.gfxBraking.position.x = -shipWidth / 2
    this.gfxBraking.position.y = shipHeight / 2 + 5
    this.gfxBraking.visible = false
    this.PIXIContainer.addChild(this.gfxBraking)
    this.gfxReversing.addChild(this.drawBrakingForce(0xffffff))
    this.gfxReversing.position.x = -shipWidth / 2
    this.gfxReversing.position.y = shipHeight / 2 + 5
    this.gfxReversing.visible = false
    this.PIXIContainer.addChild(this.gfxReversing)
    this.PIXIContainer.addChild(this.draw())
    this.fireTimer = this.fireRate
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  handleKeyDown(e) {
    // console.log(e.which)
    if (!this.data.isAlive) {
      return false
    }

    // Handle key down for thursting & braking
    if (e.which === 87 || e.which === 38) {
      this.data.isThrusting = true
    } else if (e.which === 83 || e.which === 40) {
      this.data.isBraking = true
    }

    // Handle key down for rotating
    if (e.which === 65) {
      this.rotating.left = true
    } else if (e.which === 68) {
      this.rotating.right = true
    }

    // Handle key down for lateral thrusting
    if (e.which === 81 || e.which === 37) {
      this.data.isLateralThrustingLeft = true
    } else if (e.which === 69 || e.which === 39) {
      this.data.isLateralThrustingRight = true
    }

    // Handle key down for firing weapon
    if (e.which === 32) {
      this.data.isFiringWeapon = true
    }
  }

  handleKeyUp(e) {
    if (!this.data.isAlive) {
      return false
    }

    // Handle key up for thursting & braking
    if (e.which === 87 || e.which === 38) {
      this.data.isThrusting = false
    } else if (e.which === 83 || e.which === 40) {
      this.data.isBraking = false
    }

    // Handle key up for rotating
    if (e.which === 65) {
      this.rotating.left = false
    } else if (e.which === 68) {
      this.rotating.right = false
    }

    // Handle key up for lateral thrusting
    if (e.which === 81 || e.which === 37) {
      this.data.isLateralThrustingLeft = false
    } else if (e.which === 69 || e.which === 39) {
      this.data.isLateralThrustingRight = false
    }

    // Handle key up for firing weapon
    if (e.which === 32) {
      this.data.isFiringWeapon = false
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

  drawThrustingForce(rotation = 0, scale = 0.4) {
    const triangle = new PIXI.Graphics()
    triangle.beginFill(0xffff00)
    triangle.drawPolygon([
      -shipWidth / 2, shipHeight / 2,
      shipWidth / 2, shipHeight / 2,
      0, -shipHeight / 2,
      -shipWidth / 2, shipHeight / 2
    ])
    triangle.endFill()
    triangle.scale.x = scale
    triangle.scale.y = scale
    triangle.rotation = rotation * Math.PI / 180
    return triangle
  }

  drawBrakingForce(color = 0xff0000) {
    const rect = new PIXI.Graphics()
    rect.beginFill(color)
    rect.drawRect(0, 0, shipWidth, 4)
    rect.endFill()
    return rect
  }

  handleGfxDisplay() {
    this.gfxThrusting.visible = this.data.fuel > 0 ? this.data.isThrusting : false
    this.gfxLateralThrustingLeft.visible = this.data.fuel > 0 ? this.data.isLateralThrustingRight : false
    this.gfxLateralThrustingRight.visible = this.data.fuel > 0 ? this.data.isLateralThrustingLeft : false
    this.gfxBraking.visible = this.data.isBraking
    this.gfxReversing.visible = this.data.isReversing
  }

  update(playerShipProps, delta) {
    this.facingAngle = this.PIXIContainer.rotation * 180 / Math.PI
    // console.log(this.facingAngle)

    // Set magnitude of speed
    this.data.speed = Math.sqrt(this.data.velocity.y * this.data.velocity.y + this.data.velocity.x * this.data.velocity.x)
    this.lateralThrustSpd = Math.sqrt(this.data.lateralThrustForce.y * this.data.lateralThrustForce.y + this.data.lateralThrustForce.x * this.data.lateralThrustForce.x)
    // console.log(this.data.speed)
    // console.log(this.lateralThrustSpd)

    // if (this.data.speed > this.data.speedMax) {
    //   this.data.speed = this.data.speedMax
    // }

    // if (this.lateralThrustSpd > this.data.lateralThrustSpdMax) {
    //   this.lateralThrustSpd = this.data.lateralThrustSpdMax
    // }

    // Handle rotational acceleration and velocity
    const rotDir = this.rotating.right ? 1 : this.rotating.left ? -1 : 0
    if (Math.abs(this.data.rotationalVelocity) < this.data.rotSpdMax) {
      this.data.rotationalVelocity += this.data.rotAccel * rotDir
    }

    // Handle thrusting acceleration and velocity
    if (this.data.isThrusting && this.data.speed < this.data.speedMax && this.data.fuel > 0) {
      this.data.velocity.x += this.data.thrustPower * Math.cos(this.PIXIContainer.rotation - offsetAngle)
      this.data.velocity.y += this.data.thrustPower * Math.sin(this.PIXIContainer.rotation - offsetAngle)
    }

    // Handle lateralThrusting forces
    const lateralThrustDir = this.data.isLateralThrustingRight ? 1 : this.data.isLateralThrustingLeft ? -1 : 0
    if (lateralThrustDir !== 0 && this.lateralThrustSpd < this.data.lateralThrustSpdMax && this.data.fuel > 0) {
      const lateralThrustForceX = this.data.lateralThrustPower * Math.cos(this.PIXIContainer.rotation) * lateralThrustDir
      const lateralThrustForceY = this.data.lateralThrustPower * Math.sin(this.PIXIContainer.rotation) * lateralThrustDir
      this.data.lateralThrustForce.x += lateralThrustForceX
      this.data.lateralThrustForce.y += lateralThrustForceY
      this.data.velocity.x += lateralThrustForceX
      this.data.velocity.y += lateralThrustForceY
    }

    // Handle braking
    if (this.data.isBraking) {
      // console.log('isBraking')
      this.data.velocity.x *= this.data.brakePower
      this.data.velocity.y *= this.data.brakePower
      this.data.rotationalVelocity *= this.data.brakePower
      if (this.data.speed < 0.5) {
        this.data.isReversing = this.data.fuel > 0 ? true : false
      }
    } else if (this.data.speed > 0) {
      this.data.isReversing = false
    }

    // Handle reversing
    if (this.data.isReversing && this.data.fuel > 0) {
      // console.log('isReversing')
      const reverseForceX = this.data.reverseThrustPower * Math.cos(this.PIXIContainer.rotation - offsetAngle - 180 * Math.PI / 180)
      const reverseForceY = this.data.reverseThrustPower * Math.sin(this.PIXIContainer.rotation - offsetAngle - 180 * Math.PI / 180)
      this.data.reverseThrustForce.x += reverseForceX
      this.data.reverseThrustForce.y += reverseForceY
      this.data.velocity.x += reverseForceX
      this.data.velocity.y += reverseForceY
    }

    // Handle decceleration from mass
    this.data.velocity.x *= this.data.mass
    this.data.velocity.y *= this.data.mass
    if (Math.abs(Math.round(this.data.velocity.x * 100) / 100) <= 0) {
      this.data.velocity.x = 0
    }
    if (Math.abs(Math.round(this.data.velocity.y * 100) / 100) <= 0) {
      this.data.velocity.y = 0
    }

    this.data.lateralThrustForce.x *= this.data.mass
    this.data.lateralThrustForce.y *= this.data.mass
    if (Math.abs(Math.round(this.data.lateralThrustForce.x * 100) / 100) <= 0) {
      this.data.lateralThrustForce.x = 0
    }
    if (Math.abs(Math.round(this.data.lateralThrustForce.y * 100) / 100) <= 0) {
      this.data.lateralThrustForce.y = 0
    }

    this.data.reverseThrustForce.x *= this.data.mass
    this.data.reverseThrustForce.y *= this.data.mass
    if (Math.abs(Math.round(this.data.reverseThrustForce.x * 100) / 100) <= 0) {
      this.data.reverseThrustForce.x = 0
    }
    if (Math.abs(Math.round(this.data.reverseThrustForce.y * 100) / 100) <= 0) {
      this.data.reverseThrustForce.y = 0
    }

    if (rotDir === 0) {
      this.data.rotationalVelocity *= this.data.mass * 0.8
      if (Math.abs(Math.round(this.data.rotationalVelocity * 100) / 100) <= 0) {
        this.data.rotationalVelocity = 0
      }
    }

    // Bounds checking
    if (this.PIXIContainer.x + this.data.velocity.x < 0) {
      this.data.velocity.x = 0
      this.data.velocity.y = 0
      this.PIXIContainer.x = 0
    } else if (this.PIXIContainer.x + this.data.velocity.x > this.sceneBounds.width) {
      this.data.velocity.x = 0
      this.data.velocity.y = 0
      this.PIXIContainer.x = this.sceneBounds.width
    } else if (this.PIXIContainer.y + this.data.velocity.y < 0) {
      this.data.velocity.x = 0
      this.data.velocity.y = 0
      this.PIXIContainer.y = 0
    } else if (this.PIXIContainer.y + this.data.velocity.y > this.sceneBounds.height) {
      this.data.velocity.x = 0
      this.data.velocity.y = 0
      this.PIXIContainer.y = this.sceneBounds.height
    } else {
      // Update position
      this.PIXIContainer.rotation += this.data.rotationalVelocity * delta
      this.PIXIContainer.x += this.data.velocity.x * delta
      this.PIXIContainer.y += this.data.velocity.y * delta
    }

    // Handle shields regen timer
    this.shieldsRegenTimer += delta
    this.shieldsRegenReadyTimer += delta

    if (this.shieldsRegenReadyTimer >= this.shieldsRegenReadyTime) {
      this.shieldsRegenIsReady = true
      this.shieldsRegenReadyTimer = 0
    }

    // Handle energy regen time
    this.energyRegenTimer += delta

    // Handle firing of weapon timer
    this.fireTimer += delta

    this.handleGfxDisplay()

    // Update local data
    this.data = {
      ...playerShipProps,
      ...this.data
    }
    // console.log(this.data.isThrusting)
  }
}

export default PlayerShip
