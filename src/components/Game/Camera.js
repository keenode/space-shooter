class Camera {
  scane = null
  trackingEntity = null
  renderer = null

  constructor(scene, trackingEntity, renderer) {
    this.scene = scene
    this.trackingEntity = trackingEntity
    this.renderer = renderer
  }

  update(delta) {
    this.scene.x = -this.trackingEntity.x + this.renderer.width / 2
    this.scene.y = -this.trackingEntity.y + this.renderer.height / 2
  }
}

export default Camera
