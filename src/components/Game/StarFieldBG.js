import * as PIXI from 'pixi.js'

const numStars = 4096
const numFuzzyStars = 1024
const numFuzziestStars = 512
const starColors = [
  0xffffff,
  0xffbcc4,
  0xbaf8ff,
  0xfec7ff,
  0xfff4d9,
  0xff6c6c
]

class StarFieldBG {
  PIXIContainer = new PIXI.Container()
  sceneBounds = null

  constructor(sceneBounds, depth = 1) {
    this.sceneBounds = sceneBounds
    this.depth = depth
    this.PIXIContainer.addChild(this.draw())
    for (let i = 0; i < numFuzzyStars; i++) {
      const starSprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/stars/star.png'].texture
      )
      this.addStarSrite(starSprite)
    }
    for (let i = 0; i < numFuzziestStars; i++) {
      const starSprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/stars/star-fuzzier.png'].texture
      )
      this.addStarSrite(starSprite)
    }
    this.PIXIContainer.cacheAsBitmap = true
  }

  addStarSrite(starSprite) {
    const color = starColors[Math.floor(Math.random() * starColors.length)]
    const scale = Math.random() * 1
    starSprite.width = (starSprite.width / 2) * scale
    starSprite.height = (starSprite.height / 2) * scale
    starSprite.x = Math.floor(Math.random() * this.sceneBounds.width)
    starSprite.y = Math.floor(Math.random() * this.sceneBounds.height)
    starSprite.tint = color
    this.PIXIContainer.addChild(starSprite)
  }

  draw() {
    const circle = new PIXI.Graphics()
    for (let i = 0; i < numStars; i++) {
      const color = starColors[Math.floor(Math.random() * starColors.length)]
      const xPos = Math.floor(Math.random() * this.sceneBounds.width)
      const yPos = Math.floor(Math.random() * this.sceneBounds.height)
      let radius = Math.round((Math.random() * 3 * 100) / this.depth) / 100
      const alpha = Math.round(Math.random() * 1 * 100) / 100
      if (radius < 1) {
        radius = 1
      }
      circle.beginFill(color, alpha)
      circle.drawCircle(xPos, yPos, radius)
      circle.endFill()
    }
    return circle
  }
}

export default StarFieldBG
