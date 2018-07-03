import React, { Component } from 'react'
import * as PIXI from 'pixi.js'

import PlayerShip from '../../components/Game/PlayerShip'

import styles from './GameCanvas.css'

const playRegionBounds = {
  width: 440,
  height: 680,
  offsetTop: 40
}

class GameCanvas extends Component {
  playReigion = new PIXI.Container()
  playerShip = null

  componentDidMount() {
    this.setupPIXI('game-canvas')
    this.setupPlayRegion()
    this.placeEntities()
    this.gameApp.ticker.add(delta => this.gameLoop(delta))
  }

  setupPIXI(canvasSelectorId) {
    const $gameCanvas = document.getElementById(canvasSelectorId)
    this.gameApp = new PIXI.Application({
      width: $gameCanvas.offsetWidth,
      height: $gameCanvas.offsetHeight,
      // antialias: true
    })
    this.gameApp.renderer.backgroundColor = 0x050404
    this.gameApp.renderer.autoResize = true
    document.getElementById(canvasSelectorId).appendChild(this.gameApp.view)

    window.onresize = () => {
      this.gameApp.renderer.resize($gameCanvas.offsetWidth, $gameCanvas.offsetHeight)      
    }

    // Add FPS counter
    const style = new PIXI.TextStyle({
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontSize: 20,
      fill: 'cyan'
    })
    this.fpsText = new PIXI.Text('', style)
    this.fpsText.x = 15
    this.fpsText.y = 15

    this.gameApp.stage.addChild(this.playReigion)
    this.gameApp.stage.addChild(this.fpsText)
  }

  setupPlayRegion() {
    console.log(this.gameApp.renderer.width)
    this.playReigion.x = this.gameApp.renderer.width / 2 - playRegionBounds.width / 2
    this.playReigion.y = playRegionBounds.offsetTop
    this.playReigion.addChild(this.drawPlayRegionBounds())
  }

  placeEntities() {
    this.playerShip = new PlayerShip(playRegionBounds)
    this.playReigion.addChild(this.playerShip.PIXIContainer)
  }

  drawPlayRegionBounds() {
    const rect = new PIXI.Graphics()
    rect.lineStyle(1, 0x00ff00, 1)
    rect.drawRect(0, 0, playRegionBounds.width, playRegionBounds.height)
    return rect
  }

  gameLoop(delta) {
    // this.camera.update(delta)
    this.fpsText.text = Math.round(this.gameApp.ticker.FPS) + ' FPS'
  }

  render() {
    return (
      <div id="game-canvas" className={styles.GameCanvas}></div>
    )
  }
}

export default GameCanvas
