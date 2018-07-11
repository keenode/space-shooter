import React, { Component } from 'react'
import * as PIXI from 'pixi.js'
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom'
import { MotionBlurFilter } from '@pixi/filter-motion-blur'
import { Howl } from 'howler'

import { collisionTest } from '../Game/Utility'

import Camera from '../Game/Camera'
import PlayerShip from '../Game/PlayerShip'
import EnemyShip from '../Game/EnemyShip'
import Projectile from '../Game/Projectile'
import StarFieldAmbientBG from '../Game/StarFieldAmbientBG'
import Nebula from '../Game/Nebula'

import gfxConfig from '../../config/graphics'

import styles from './GameCanvas.css'

const sceneBounds = {
  width: 4000,
  height: 4000
}
const motionBlurMultiplier = 3.0

class GameCanvas extends Component {
  camera = null
  scene = new PIXI.Container()
  sceneBg = new PIXI.Container()
  playerContainer = new PIXI.Container()
  entitiesContainer = new PIXI.Container()
  worldContainer = new PIXI.Container()
  bloomContainer = new PIXI.Container()
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
  nebulas = {
    data: [],
    container: new PIXI.Container()
  }
  starFieldAmbientBGs = []
  playerDeadReported = false
  playerNoFuelReported = false
  motionBlurFilter = new MotionBlurFilter()

  componentDidMount() {
    this.setupPIXI('game-canvas')
    this.setupScene()
    this.placeEntities()
    this.camera = new Camera(this.scene, this.playerShip.PIXIContainer, this.gameApp.renderer, this.starFieldAmbientBGs, this.nebulas.container)
    this.gameApp.ticker.add(delta => this.gameLoop(delta))

    // Play atmosphere SFX
    const atmosphereSfx = new Howl({
      src: ['assets/audio/fx/atmosphere.flac'],
      loop: true,
      volume: 0.3
    })
    atmosphereSfx.play()
  }

  setupPIXI(canvasSelectorId) {
    const $gameCanvas = document.getElementById(canvasSelectorId)
    this.gameApp = new PIXI.Application({
      width: $gameCanvas.offsetWidth,
      height: $gameCanvas.offsetHeight,
      antialias: true
    })
    this.gameApp.renderer.backgroundColor = 0x0a182f
    this.gameApp.renderer.autoResize = true
    document.getElementById(canvasSelectorId).appendChild(this.gameApp.view)

    window.onresize = () => {
      this.gameApp.renderer.resize($gameCanvas.offsetWidth, $gameCanvas.offsetHeight)
    }

    // Add FPS counter
    const style = new PIXI.TextStyle({
      fontFamily: '"Audiowide", monospace',
      fontSize: 20,
      fill: 'cyan'
    })
    this.fpsText = new PIXI.Text('', style)
    this.fpsText.x = 15
    this.fpsText.y = 15

    this.gameApp.stage.addChild(this.scene)
    this.gameApp.stage.addChild(this.fpsText)
  }

  setupScene() {
    // Add ambient star field
    for (let i = 0; i < gfxConfig.starFieldDepth; i++) {
      const starFieldBg = new StarFieldAmbientBG(sceneBounds, i + 1)
      this.starFieldAmbientBGs.push(starFieldBg)
      this.sceneBg.addChild(starFieldBg.PIXIContainer)
    }

    // Add ambient nebula
    if (gfxConfig.nebula) {
      for (let i = 0; i < 10; i++) {
        const nebula = new Nebula(sceneBounds)
        this.nebulas.data.push(nebula)
        this.nebulas.container.addChild(nebula.PIXIContainer)
      }
      this.sceneBg.addChild(this.nebulas.container)
    }

    this.worldContainer.addChild(this.drawsceneBounds())

    if (gfxConfig.bloom) {
      const bloomFilter = new AdvancedBloomFilter()
      bloomFilter.threshold = 0.3
      bloomFilter.bloomScale = 1
      bloomFilter.brightness = 1
      bloomFilter.blur = 4
      bloomFilter.quality = 8
      this.bloomContainer.filters = [bloomFilter]
    }

    this.bloomContainer.addChild(this.worldContainer)
    this.bloomContainer.addChild(this.entitiesContainer)
    this.bloomContainer.addChild(this.playerContainer)
    // this.bloomContainer.addChild(this.sceneBg)

    this.scene.addChild(this.sceneBg)
    this.scene.addChild(this.bloomContainer)

    if (gfxConfig.motionBlur) {
      this.sceneBg.filters = [this.motionBlurFilter]
      this.worldContainer.filters = [this.motionBlurFilter]
    }
    // this.entitiesContainer.filters = [this.motionBlurFilter]
  }

  placeEntities() {
    // Player
    this.playerShip = new PlayerShip(this.props.playerShip, sceneBounds)
    this.playerContainer.addChild(this.playerProjectiles.container)
    this.playerContainer.addChild(this.playerShip.PIXIContainer)

    // Enemies
    const numEnemies = 32
    for (let e = 0; e < numEnemies; e++) {
      const enemy = new EnemyShip(Math.random() * sceneBounds.width, Math.random() * sceneBounds.height, sceneBounds)
      this.enemies.data.push(enemy)
      this.enemies.container.addChild(enemy.PIXIContainer)
    }
    this.entitiesContainer.addChild(this.enemies.container)
    this.entitiesContainer.addChild(this.enemyProjectiles.container)
  }

  drawsceneBounds() {
    const rect = new PIXI.Graphics()
    rect.lineStyle(1, 0x00ff00, 1)
    rect.drawRect(0, 0, sceneBounds.width, sceneBounds.height)
    return rect
  }

  damagePlayerShip(dmgAmt) {
    if (this.props.playerShip.hull <= 0) {
      return false
    }
    if (this.props.playerShip.shields > 0) {
      const dmgDiff = this.props.playerShip.shields - dmgAmt
      this.playerShip.data.shields -= dmgAmt
      if (this.playerShip.data.shields < 0) {
        this.playerShip.data.shields = 0
      }
      if (dmgDiff >= 0) {
        this.props.notificationReported(`Shields absorbed ${dmgAmt} damage!`, 'shieldsDamaged')
      } else {
        const shieldsDamageAmt = dmgDiff + dmgAmt
        this.props.notificationReported(`Shields absorbed ${shieldsDamageAmt} damage!`, 'shieldsDamaged')
        this.props.notificationReported(`Hull took ${Math.abs(dmgDiff)} damage!`, 'hullDamaged')
        this.playerShip.data.hull += dmgDiff
      }
    } else {
      this.playerShip.data.hull -= dmgAmt
      this.props.notificationReported(`Hull took ${dmgAmt} damage!`, 'hullDamaged')
    }

    if (this.playerShip.data.hull < 0) {
      this.playerShip.data.hull = 0
    }
  }

  gameLoop(delta) {
    // Update player ship data from store with updated data from gameloop
    this.playerShip.update(this.props.playerShip, delta)
    this.props.gameloopPlayerShipUpdated(this.playerShip.data)

    // Check for player death
    if (!this.props.playerShip.isAlive && !this.playerDeadReported) {
      this.props.notificationReported('Your ship has been destroyed!', 'playerShipDestroyed')
      this.playerDeadReported = true

      const hitSfx = new Howl({
        src: ['assets/audio/fx/explode.wav'],
        volume: 0.5
      })
      hitSfx.play()
    }

    // Spawn projectiles if player is firing weapon
    if (this.props.playerShip.isFiringWeapon) {
      const projectile = new Projectile(this.playerShip)
      this.playerProjectiles.data.push(projectile)
      this.playerProjectiles.container.addChild(projectile.PIXIContainer)
    }

    // Report no fuel if tank is empty!
    if (this.props.playerShip.fuel <= 0 && !this.playerNoFuelReported) {
      this.props.notificationReported('You ran out of fuel!', 'noFuel')
      this.playerNoFuelReported = true
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

        // const laserSfx = new Howl({
        //   src: ['assets/audio/fx/laser.wav'],
        //   volume: 0.1
        // })
        // laserSfx.play()
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

      // Check enemy collision with player
      if (collisionTest(enemy.PIXIContainer, this.playerShip.PIXIContainer)) {
        enemy.isAlive = false
        this.damagePlayerShip(Math.floor(Math.random() * 25) + 50)
        this.playerShip.shieldsRegenIsReady = false

        const hitSfx = new Howl({
          src: ['assets/audio/fx/explode.wav'],
          volume: 0.3
        })
        hitSfx.play()
      }

      // Check enemy collision with player projectiles
      for (let p = 0; p < this.playerProjectiles.data.length; p++) {
        const projectile = this.playerProjectiles.data[p]
        if (collisionTest(enemy.PIXIContainer, projectile.PIXIContainer)) {
          projectile.isAlive = false
          enemy.isAlive = false

          const hitSfx = new Howl({
            src: ['assets/audio/fx/explode.wav'],
            volume: 0.3
          })
          hitSfx.play()
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
        projectile.isAlive = false
        this.damagePlayerShip(Math.floor(Math.random() * 15) + 5)
        this.playerShip.shieldsRegenIsReady = false

        const hitSfx = new Howl({
          src: ['assets/audio/fx/hit.wav'],
          volume: 0.3
        })
        hitSfx.play()
      }
    }

    // Update nebulas
    for (let n = 0; n < this.nebulas.data.length; n++) {
      this.nebulas.data[n].update(delta)
    }

    // Update camera position
    this.camera.update(delta)

    // Update motion blur FX
    this.motionBlurFilter.velocity = [this.playerShip.vx * motionBlurMultiplier, this.playerShip.vy * motionBlurMultiplier]

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
