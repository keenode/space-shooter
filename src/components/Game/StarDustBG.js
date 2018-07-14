import * as PIXI from 'pixi.js'

const numStarDusts = 10
const dustAssetPaths = [
  'assets/images/stardust/stardust-1.png'
]

class StarDustBG {
  PIXIContainer = new PIXI.Container()
  sceneBounds = null

  constructor(sceneBounds) {
    this.sceneBounds = sceneBounds
    this.generawteDust()
    this.PIXIContainer.cacheAsBitmap = true
  }

  generawteDust() {
    for (let d = 0; d < numStarDusts; d++) {
      const assetPath = dustAssetPaths[Math.floor(Math.random() * dustAssetPaths.length)]
      const stardustSprite = new PIXI.Sprite(
        PIXI.loader.resources[assetPath].texture
      )
      const color =  Math.random() * 0xFFFFFF
      stardustSprite.x = Math.floor(Math.random() * this.sceneBounds.width)
      stardustSprite.y = Math.floor(Math.random() * this.sceneBounds.height)
      stardustSprite.rotation = Math.random() * Math.PI * 2
      stardustSprite.scale.x = Math.random() * 0.5 + 1.5
      stardustSprite.scale.y = Math.random() * 0.5 + 1.5
      stardustSprite.alpha = Math.random() * 1
      stardustSprite.tint = color
      this.PIXIContainer.addChild(stardustSprite)
    }
  }

  update(delta) {
  }
}

export default StarDustBG
