import * as PIXI from 'pixi.js'
require('pixi-particles')

class Nebula {
  PIXIContainer = new PIXI.Container()
  emitter = null
  sceneBounds = null

  constructor(sceneBounds) {
    this.sceneBounds = sceneBounds
    // this.PIXIContainer.addChild(this.draw())
    this.PIXIContainer.x = Math.floor(Math.random() * this.sceneBounds.width)
    this.PIXIContainer.y = Math.floor(Math.random() * this.sceneBounds.height)

    // Create a new emitter
    this.emitter = new PIXI.particles.Emitter(
      // The PIXI.Container to put the emitter in
      // if using blend modes, it's important to put this
      // on top of a bitmap, and not use the root stage Container
      this.PIXIContainer,
      [
        PIXI.Texture.fromImage('assets/images/particles/smokeparticle.png'),
        PIXI.Texture.fromImage('assets/images/particles/particle.png')
      ],
      {
        "alpha": {
          "start": 0,
          "end": 0.5
        },
        "scale": {
          "start": 2,
          "end": 0,
          "minimumScaleMultiplier": 3
        },
        "color": {
          "start": "#8961ff",
          "end": "#94cfff"
        },
        "speed": {
          "start": 10,
          "end": 10,
          "minimumSpeedMultiplier": 1
        },
        "acceleration": {
          "x": 0,
          "y": 0
        },
        "maxSpeed": 0,
        "startRotation": {
          "min": 0,
          "max": 360
        },
        "noRotation": false,
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 10,
          "max": 100
        },
        "blendMode": "screen",
        "frequency": 0.001,
        "emitterLifetime": -1,
        "maxParticles": 40,
        "pos": {
          "x": 0,
          "y": 0
        },
        "addAtBack": true,
        "spawnType": "circle",
        "spawnCircle": {
          "x": 0,
          "y": 0,
          "r": 300
        }
      }
    )
    this.emitter.emit = true
    this.addFilterFX()
  }

  addFilterFX() {
    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 64
    blurFilter.quality = 8
    this.PIXIContainer.filters = [blurFilter]
  }

  draw() {
    const circle = new PIXI.Graphics()
    const radius = 100
    circle.beginFill(0x0000ff, 0.1)
    circle.drawCircle(0, 0, radius)
    circle.endFill()
    return circle
  }

  update(delta) {
    this.emitter.update(delta * 0.01)
  }
}

export default Nebula
