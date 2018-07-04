import React, { Component } from 'react'
import * as PIXI from 'pixi.js'

import { collisionTest } from '../../components/Game/Utility' 

import PlayerShip from '../../components/Game/PlayerShip'
import EnemyShip from '../../components/Game/EnemyShip'
import Projectile from '../../components/Game/Projectile'

import styles from './GameCanvas.css'

const playRegionBounds = {
  width: 900,
  height: 680,
  offsetTop: 40
}

class GameCanvas extends Component {
  playReigion = new PIXI.Container()
  playerShip = null
  enemies = {
    data: [],
    container: new PIXI.Container()
  }
  playerProjectiles = {
    data: [],
    container: new PIXI.Container()
  }
  enemyProjectiles = {
    data: [],
    container: new PIXI.Container()
  }

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
    this.playReigion.x = this.gameApp.renderer.width / 2 - playRegionBounds.width / 2
    this.playReigion.y = playRegionBounds.offsetTop
    this.playReigion.addChild(this.drawPlayRegionBounds())
  }

  placeEntities() {
    // Player
    this.playerShip = new PlayerShip(playRegionBounds)
    this.playReigion.addChild(this.playerShip.PIXIContainer)
    this.playReigion.addChild(this.playerProjectiles.container)

    // Enemies
    const enemy1 = new EnemyShip(100, 100, playRegionBounds)
    this.enemies.data.push(enemy1)
    this.enemies.container.addChild(enemy1.PIXIContainer)
    const enemy2 = new EnemyShip(200, 125, playRegionBounds)
    this.enemies.data.push(enemy2)
    this.enemies.container.addChild(enemy2.PIXIContainer)
    const enemy3 = new EnemyShip(300, 75, playRegionBounds)
    this.enemies.data.push(enemy3)
    this.enemies.container.addChild(enemy3.PIXIContainer)
    const enemy4 = new EnemyShip(400, 50, playRegionBounds)
    this.enemies.data.push(enemy4)
    this.enemies.container.addChild(enemy4.PIXIContainer)
    const enemy5 = new EnemyShip(500, 150, playRegionBounds)
    this.enemies.data.push(enemy5)
    this.enemies.container.addChild(enemy5.PIXIContainer)

    this.playReigion.addChild(this.enemies.container)
    this.playReigion.addChild(this.enemyProjectiles.container)
  }

  drawPlayRegionBounds() {
    const rect = new PIXI.Graphics()
    rect.lineStyle(1, 0x00ff00, 1)
    rect.drawRect(0, 0, playRegionBounds.width, playRegionBounds.height)
    return rect
  }

  gameLoop(delta) {
    // Hande player updates
    this.playerShip.update(delta)
    if (this.playerShip.isFiring && this.playerShip.fireTimer >= this.playerShip.fireRate) {
      const projectile = new Projectile(this.playerShip)
      this.playerProjectiles.data.push(projectile)
      this.playerProjectiles.container.addChild(projectile.PIXIContainer)
      this.playerShip.fireTimer = 0
    }

    // Handle enemy updates
    for (let b = 0; b < this.enemies.data.length; b++) {
      const enemy = this.enemies.data[b]
      enemy.update(delta)
      if (enemy.nextAttackElapsed >= enemy.nextAttackTimer) {
        const projectile = new Projectile(enemy)
        this.enemyProjectiles.data.push(projectile)
        this.enemyProjectiles.container.addChild(projectile.PIXIContainer)
        enemy.nextAttackElapsed = 0
        enemy.nextAttackTimer = Math.random() * 175.0 + 25.0
      }
    }

    // Handle player projectile updates
    for (let p = 0; p < this.playerProjectiles.data.length; p++) {
      const projectile = this.playerProjectiles.data[p]
      projectile.update(delta)
      // TODO: Current logic causing weird positoning stutter upon removal
      if (!projectile.isAlive) {
        this.playerProjectiles.data.splice(p, 1)
        this.playerProjectiles.container.removeChildAt(p)
      }
    }

    // Handle enemy projectile updates
    for (let p = 0; p < this.enemyProjectiles.data.length; p++) {
      const projectile = this.enemyProjectiles.data[p]
      projectile.update(delta)
      // TODO: Current logic causing weird positoning stutter upon removal
      if (!projectile.isAlive) {
        this.enemyProjectiles.data.splice(p, 1)
        this.enemyProjectiles.container.removeChildAt(p)
      }
    }

    // Handle collisons
    for (let b = 0; b < this.enemies.data.length; b++) {
      const enemy = this.enemies.data[b]

      // Check collision with player
      if (collisionTest(enemy.PIXIContainer, this.playerShip.PIXIContainer)) {
        console.log('crash')
        enemy.isAlive = false
      }

      // Check enemy collision with player projectiles
      for (let p = 0; p < this.playerProjectiles.data.length; p++) {
        const projectile = this.playerProjectiles.data[p]
        if (collisionTest(enemy.PIXIContainer, projectile.PIXIContainer)) {
          console.log('hit')
          projectile.isAlive = false
          enemy.isAlive = false
        }
      }

      if (!enemy.isAlive) {
        this.enemies.data.splice(b, 1)
        this.enemies.container.removeChildAt(b)
      }
    }

    // Check player collision with enemy projectiles
    for (let p = 0; p < this.enemyProjectiles.data.length; p++) {
      const projectile = this.enemyProjectiles.data[p]
      if (collisionTest(this.playerShip.PIXIContainer, projectile.PIXIContainer)) {
        console.log('damage')
        projectile.isAlive = false
      }
    }

    // Update FPS text
    this.fpsText.text = Math.round(this.gameApp.ticker.FPS) + ' FPS'
  }

  render() {
    return (
      <div id="game-canvas" className={styles.GameCanvas}></div>
    )
  }
}

export default GameCanvas
