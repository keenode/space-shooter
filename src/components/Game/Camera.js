const starFieldParallaxAmt = 0.08

class Camera {
  scane = null
  trackingEntity = null
  renderer = null
  starFieldAmbientBGs = null

  constructor(scene, trackingEntity, renderer, starFieldAmbientBGs) {
    this.scene = scene
    this.trackingEntity = trackingEntity
    this.renderer = renderer
    this.starFieldAmbientBGs = starFieldAmbientBGs
  }

  update(delta) {
    this.scene.x = -this.trackingEntity.x + this.renderer.width / 2
    this.scene.y = -this.trackingEntity.y + this.renderer.height / 2
    for (let i = 0; i < this.starFieldAmbientBGs.length; i++) {
      this.starFieldAmbientBGs[i].PIXIContainer.x = -this.scene.x * starFieldParallaxAmt * (i + 1)
      this.starFieldAmbientBGs[i].PIXIContainer.y = -this.scene.y * starFieldParallaxAmt * (i + 1)
    }
  }
}

export default Camera
