const nebulasParallaxAmt = 0.3
const starFieldParallaxAmt = 0.08

class Camera {
  scane = null
  trackingEntity = null
  renderer = null
  starFieldAmbientBGs = null
  nebulas = null

  constructor(scene, trackingEntity, renderer, starFieldAmbientBGs, nebulas) {
    this.scene = scene
    this.trackingEntity = trackingEntity
    this.renderer = renderer
    this.starFieldAmbientBGs = starFieldAmbientBGs
    this.nebulas = nebulas
  }

  update(delta) {
    this.scene.x = -this.trackingEntity.x + this.renderer.width / 2
    this.scene.y = -this.trackingEntity.y + this.renderer.height / 2
    this.nebulas.x = -this.scene.x * nebulasParallaxAmt
    this.nebulas.y = -this.scene.y * nebulasParallaxAmt
    for (let i = 0; i < this.starFieldAmbientBGs.length; i++) {
      this.starFieldAmbientBGs[i].PIXIContainer.x = -this.scene.x * starFieldParallaxAmt * (i + 1)
      this.starFieldAmbientBGs[i].PIXIContainer.y = -this.scene.y * starFieldParallaxAmt * (i + 1)
    }
  }
}

export default Camera
