import * as PIXI from 'pixi.js'

const numStarDusts = 8
const dustAssetPaths = [
  'assets/images/stardust/stardust-1.png',
  'assets/images/stardust/stardust-2.png',
  'assets/images/stardust/stardust-3.png',
  'assets/images/stardust/stardust-4.png'
]

class StarDustBG {
  PIXIContainer = new PIXI.Container()
  sceneBounds = null
  stardusts = []

  constructor(sceneBounds) {
    this.sceneBounds = sceneBounds
    this.generateDust()
  }

  generateDust() {
    for (let d = 0; d < numStarDusts; d++) {
      const assetPath = dustAssetPaths[Math.floor(Math.random() * dustAssetPaths.length)]
      const stardustSprite = new PIXI.Sprite(
        PIXI.loader.resources[assetPath].texture
      )
      const color =  Math.random() * 0xFFFFFF
      stardustSprite.data = {}
      stardustSprite.x = Math.floor(Math.random() * this.sceneBounds.width)
      stardustSprite.y = Math.floor(Math.random() * this.sceneBounds.height)
      stardustSprite.rotation = Math.random() * Math.PI * 2
      stardustSprite.scale.x = Math.random() * 0.5 + 1.5
      stardustSprite.scale.y = Math.random() * 0.5 + 1.5
      stardustSprite.alpha = Math.random() * 1
      stardustSprite.tint = color
      stardustSprite.data.originalX = stardustSprite.x
      stardustSprite.data.originalY = stardustSprite.y
      stardustSprite.data.vx = 0
      stardustSprite.data.vy = 0
      stardustSprite.data.moveRotation =  Math.random() * Math.PI * 2
      stardustSprite.data.alphaMax = stardustSprite.alpha
      stardustSprite.data.accel = 0.0001
      stardustSprite.data.speed = 0
      stardustSprite.data.speedMax = Math.random() * 0.15
      stardustSprite.data.dist = 0
      stardustSprite.data.distMax = Math.random() * 2000 + 500
      this.stardusts.push(stardustSprite)
      this.PIXIContainer.addChild(stardustSprite)
    }
  }

  update(delta) {
    for (let d = 0; d < this.stardusts.length; d++) {
      const stardust = this.stardusts[d]
      stardust.data.speed = Math.sqrt(stardust.data.vy * stardust.data.vy + stardust.data.vx * stardust.data.vx)

      if (stardust.data.dist < stardust.data.distMax) {
        const distX = this.stardusts[d].x - stardust.data.originalX
        const distY = this.stardusts[d].y - stardust.data.originalY
        stardust.data.dist = Math.sqrt(distY * distY + distX * distX)
        stardust.alpha +=  0.001 * delta
        if (stardust.alpha > stardust.data.alphaMax) {
          stardust.alpha = stardust.data.alphaMax
        }
      } else {
        stardust.alpha -= 0.001 * delta

        if (stardust.alpha < 0) {
          // stardust.alpha = stardust.data.alphaMax
          stardust.x = stardust.data.originalX
          stardust.y = stardust.data.originalY
          stardust.alpha = 0
          stardust.data.vx = 0
          stardust.data.vy = 0
          stardust.data.moveRotation = Math.random() * Math.PI * 2
          stardust.data.alphaMax = Math.random() * 1
          stardust.data.speedMax = Math.random() * 0.15
          stardust.data.dist = 0
        }
      }

      // console.log(stardust.data.dist)

      if (stardust.data.speed < stardust.data.speedMax) {
        stardust.data.vx += stardust.data.accel * Math.cos(stardust.data.moveRotation)
        stardust.data.vy += stardust.data.accel * Math.sin(stardust.data.moveRotation)
      }

      // stardust.data.vx *= 0.98
      // stardust.data.vy *= 0.98

      stardust.x += stardust.data.vx * delta
      stardust.y += stardust.data.vy * delta
    }
  }
}

export default StarDustBG
