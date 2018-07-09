import React, { Component } from 'react'
import * as PIXI from 'pixi.js'
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom'
import { MotionBlurFilter } from '@pixi/filter-motion-blur'

import { collisionTest } from '../Game/Utility'

import Camera from '../Game/Camera'
import PlayerShip from '../Game/PlayerShip'
import EnemyShip from '../Game/EnemyShip'
import Projectile from '../Game/Projectile'
import StarFieldAmbientBG from '../Game/StarFieldAmbientBG'
import Nebula from '../Game/Nebula'

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
  starFieldDepth = 4
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
    for (let i = 0; i < this.starFieldDepth; i++) {
      const starFieldBg = new StarFieldAmbientBG(sceneBounds, i + 1)
      this.starFieldAmbientBGs.push(starFieldBg)
      this.sceneBg.addChild(starFieldBg.PIXIContainer)
    }
    for (let i = 0; i < 10; i++) {
      const nebula = new Nebula(sceneBounds)
      this.nebulas.data.push(nebula)
      this.nebulas.container.addChild(nebula.PIXIContainer)
    }
    this.sceneBg.addChild(this.nebulas.container)
    this.worldContainer.addChild(this.drawsceneBounds())

    const bloomFilter = new AdvancedBloomFilter()
    bloomFilter.threshold = 0.3
    bloomFilter.bloomScale = 1
    bloomFilter.brightness = 1
    bloomFilter.blur = 4
    bloomFilter.quality = 8

    this.bloomContainer.addChild(this.worldContainer)
    this.bloomContainer.addChild(this.entitiesContainer)
    this.bloomContainer.addChild(this.playerContainer)
    // this.bloomContainer.addChild(this.sceneBg)

    this.scene.addChild(this.sceneBg)
    this.scene.addChild(this.bloomContainer)

    this.bloomContainer.filters = [bloomFilter]
    this.sceneBg.filters = [this.motionBlurFilter]
    this.worldContainer.filters = [this.motionBlurFilter]
    // this.entitiesContainer.filters = [this.motionBlurFilter]
  }

  drawRadialDarken() {
    const ellipse = new PIXI.Graphics()
    ellipse.beginFill(0xffffff, 1)
    ellipse.drawEllipse(0, 0, this.gameApp.renderer.width / 2, this.gameApp.renderer.height / 2)
    ellipse.endFill()
    return ellipse
  }

  placeEntities() {
    // Player
    this.playerShip = new PlayerShip({
      shields: this.props.shields,
      fuel: this.props.fuel,
      shieldsRegenRate: this.props.shieldsRegenRate,
      energyRegenRate: this.props.energyRegenRate,
      speedMax: this.props.speedMax
    }, sceneBounds)
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

  gameLoop(delta) {
    // Hande player updates
    if (this.props.hull <= 0) {
      this.playerShip.isAlive = false
      this.playerShip.PIXIContainer.alpha = 0.25
      if (!this.playerDeadReported) {
        this.props.messageReported('Your ship has been destroyed!', 'playerShipDestroyed')
        this.playerDeadReported = true
      }
    }
    this.playerShip.update(delta)
    if (this.playerShip.isFiringWeapon && this.playerShip.fireTimer >= this.playerShip.fireRate && this.props.energy > 10) {
      const projectile = new Projectile(this.playerShip)
      this.playerProjectiles.data.push(projectile)
      this.playerProjectiles.container.addChild(projectile.PIXIContainer)
      this.playerShip.fireTimer = 0
      this.props.energyUsed(10)
    }
    this.props.speedUpdated(this.playerShip.spd)
    this.props.rotationUpdated(this.playerShip.facingAngle)
    if ((this.playerShip.isThrusting || this.playerShip.lateralThrusting.left || this.playerShip.lateralThrusting.right || this.playerShip.isReversing) && this.props.fuel > 0) {
      this.props.fuelUsed(0.1)
      this.playerShip.fuel = this.props.fuel
    }
    if (this.props.fuel <= 0 && !this.playerNoFuelReported) {
      this.props.messageReported('You ran out of fuel!', 'noFuel')
      this.playerNoFuelReported = true
    }
    if (this.playerShip.isReversing) {
      this.props.pilotModeChanged('R')
    } else {
      this.props.pilotModeChanged('D')
    }
    this.props.pilotStateChanged('thrusting', this.playerShip.isThrusting)
    this.props.pilotStateChanged('braking', this.playerShip.isBraking)
    this.props.pilotStateChanged('lateralThrustingLeft', this.playerShip.lateralThrusting.left)
    this.props.pilotStateChanged('lateralThrustingRight', this.playerShip.lateralThrusting.right)
    this.props.pilotStateChanged('firingWeapon', this.playerShip.isFiringWeapon)
    if (this.playerShip.shieldsRegenTimer >= this.playerShip.shieldsRegenRate && this.playerShip.shieldsRegenIsReady && this.playerShip.isAlive) {
      this.props.shieldsRegenerated(1)
      this.playerShip.shieldsRegenTimer = 0
    }
    if (this.playerShip.energyRegenTimer >= this.playerShip.energyRegenRate && this.playerShip.isAlive) {
      this.props.energyRegenerated(1)
      this.playerShip.energyRegenTimer = 0
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
        enemy.isAlive = false
        this.props.hullDamaged(Math.floor(Math.random() * 25) + 50)
        this.playerShip.shieldsRegenIsReady = false
      }

      // Check enemy collision with player projectiles
      for (let p = 0; p < this.playerProjectiles.data.length; p++) {
        const projectile = this.playerProjectiles.data[p]
        if (collisionTest(enemy.PIXIContainer, projectile.PIXIContainer)) {
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
        projectile.isAlive = false
        this.props.hullDamaged(Math.floor(Math.random() * 10) + 5)
        this.playerShip.shieldsRegenIsReady = false
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
