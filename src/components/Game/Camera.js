const starDustBgsParallaxAmt = 0.02
const starFieldParallaxAmt = 0.08

class Camera {
  scane = null
  trackingEntity = null
  renderer = null
  starFieldBgs = null
  starDustBgs = null

  constructor(scene, trackingEntity, renderer, starFieldBgs, starDustBgs) {
    this.scene = scene
    this.trackingEntity = trackingEntity
    this.renderer = renderer
    this.starFieldBgs = starFieldBgs
    this.starDustBgs = starDustBgs
  }

  update(delta) {
    this.scene.x = -this.trackingEntity.x + this.renderer.width / 2
    this.scene.y = -this.trackingEntity.y + this.renderer.height / 2
    for (let d = 0; d < this.starDustBgs.length; d++) {
      this.starDustBgs[d].PIXIContainer.x = this.scene.x * starDustBgsParallaxAmt * (d + 1)
      this.starDustBgs[d].PIXIContainer.y = this.scene.y * starDustBgsParallaxAmt * (d + 1)
    }
    for (let s = 0; s < this.starFieldBgs.length; s++) {
      this.starFieldBgs[s].PIXIContainer.x = -this.scene.x * starFieldParallaxAmt * (s + 1)
      this.starFieldBgs[s].PIXIContainer.y = -this.scene.y * starFieldParallaxAmt * (s + 1)
    }
  }
}

export default Camera
