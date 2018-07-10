import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'
import MessagesPanel from '../../components/UI/MessagesPanel/MessagesPanel'

import * as actions from '../../store/actions'

import styles from './GameContainer.css'

class GameContainer extends Component {
  hullDamagedHandler(dmgAmt) {
    if (this.props.playerShip.hull <= 0) {
      return false
    }
    if (this.props.playerShip.shields > 0) {
      const dmgDiff = this.props.playerShip.shields - dmgAmt
      this.props.onUpdateShields(-dmgAmt)
      if (dmgDiff >= 0) {
        this.props.onAddMessage(`Shields absorbed ${dmgAmt} damage!`, 'shieldsDamaged')
      } else {
        const shieldsDamageAmt = dmgDiff + dmgAmt
        this.props.onAddMessage(`Shields absorbed ${shieldsDamageAmt} damage!`, 'shieldsDamaged')
        this.props.onAddMessage(`Hull took ${Math.abs(dmgDiff)} damage!`, 'hullDamaged')
        this.props.onUpdateHull(dmgDiff)
      }
    } else {
      this.props.onUpdateHull(-dmgAmt)
      this.props.onAddMessage(`Hull took ${dmgAmt} damage!`, 'hullDamaged')
    }
  }

  shieldsRegeneratedHandler(regenAmt) {
    this.props.onUpdateShields(regenAmt)
  }

  energyUsedHandler(energyUsed) {
    this.props.onUpdateEnergy(-energyUsed)
  }

  energyRegeneratedHandler(regenAmt) {
    this.props.onUpdateEnergy(regenAmt)
  }

  fuelUsedHandler(value) {
    const updatedFuelValue = this.props.playerShip.fuel - value
    this.props.onUpdateFuel(updatedFuelValue)
  }

  pilotStateChangedHandler(pilotState, value) {
    if (pilotState === 'thrusting') {
      this.props.onSetIsThrusting(value)
    } else if (pilotState === 'braking') {
      this.props.onSetIsBraking(value)
    } else if (pilotState === 'lateralThrustingLeft') {
      this.props.onSetIsLateralThrustingLeft(value)
    } else if (pilotState === 'lateralThrustingRight') {
      this.props.onSetIsLateralThrustingRight(value)
    } else if (pilotState === 'firingWeapon') {
      this.props.onSetIsFiringWeapon(value)
    }
  }

  render() {
    return (
      <div className={styles.GameContainer}>
        <GameCanvas
          hull={this.props.playerShip.hull}
          shields={this.props.playerShip.shields}
          shieldsRegenRate={this.props.playerShip.shieldsRegenRate}
          energy={this.props.playerShip.energy}
          fuel={this.props.playerShip.fuel}
          speedMax={this.props.playerShip.speedMax}
          energyRegenRate={this.props.playerShip.energyRegenRate}
          hullDamaged={ dmgAmt => this.hullDamagedHandler(dmgAmt) }
          shieldsRegenerated={ regenAmt => this.shieldsRegeneratedHandler(regenAmt) }
          energyRegenerated={ regenAmt => this.energyRegeneratedHandler(regenAmt) }
          energyUsed={ energyUsed => this.energyUsedHandler(energyUsed) }
          speedUpdated={ value => this.props.onUpdateSpeed(value) }
          rotationUpdated={ value => this.props.onUpdateRotation(value) }
          fuelUsed={ value => this.fuelUsedHandler(value) }
          pilotModeChanged={ mode => this.props.onSetPilotMode(mode) }
          pilotStateChanged={ (pilotState, value) => this.pilotStateChangedHandler(pilotState, value) }
          messageReported={ (message, type) => this.props.onAddMessage(message, type) } />
        <MessagesPanel messages={this.props.messages} />
        <HullDash
          hull={this.props.playerShip.hull}
          hullMax={this.props.playerShip.hullMax}
          shields={this.props.playerShip.shields}
          shieldsMax={this.props.playerShip.shieldsMax}
          energy={this.props.playerShip.energy}
          energyMax={this.props.playerShip.energyMax}
          speed={this.props.playerShip.speed}
          speedMax={this.props.playerShip.speedMax}
          rotation={this.props.playerShip.rotation}
          fuel={this.props.playerShip.fuel}
          fuelMax={this.props.playerShip.fuelMax}
          pilotMode={this.props.playerShip.pilotMode}
          isThrusting={this.props.playerShip.isThrusting}
          isBraking={this.props.playerShip.isBraking}
          isLateralThrustingLeft={this.props.playerShip.isLateralThrustingLeft}
          isLateralThrustingRight={this.props.playerShip.isLateralThrustingRight}
          isFiringWeapon={this.props.playerShip.isFiringWeapon} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    playerShip: {
      hull: state.playerShip.hull,
      hullMax: state.playerShip.hullMax,
      shields: state.playerShip.shields,
      shieldsMax: state.playerShip.shieldsMax,
      shieldsRegenRate: state.playerShip.shieldsRegenRate,
      energy: state.playerShip.energy,
      energyMax: state.playerShip.energyMax,
      energyRegenRate: state.playerShip.energyRegenRate,
      speed: state.playerShip.speed,
      speedMax: state.playerShip.speedMax,
      rotation: state.playerShip.rotation,
      fuel: state.playerShip.fuel,
      fuelMax: state.playerShip.fuelMax,
      pilotMode: state.playerShip.pilotMode,
      isThrusting: state.playerShip.isThrusting,
      isBraking: state.playerShip.isBraking,
      isLateralThrustingLeft: state.playerShip.isLateralThrustingLeft,
      isLateralThrustingRight: state.playerShip.isLateralThrustingRight,
      isFiringWeapon: state.playerShip.isFiringWeapon
    },
    messages: state.messages.messages
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHull: value => dispatch(actions.updateHull(value)),
    onUpdateShields: value => dispatch(actions.updateShields(value)),
    onUpdateEnergy: value => dispatch(actions.updateEnergy(value)),
    onUpdateSpeed: value => dispatch(actions.updateSpeed(value)),
    onUpdateFuel: value => dispatch(actions.updateFuel(value)),
    onUpdateRotation: value => dispatch(actions.updateRotation(value)),
    onSetPilotMode: mode => dispatch(actions.setPilotMode(mode)),
    onSetIsThrusting: isThrusting => dispatch(actions.setIsThrusting(isThrusting)),
    onSetIsBraking: isBraking => dispatch(actions.setIsBraking(isBraking)),
    onSetIsLateralThrustingLeft: isLateralThrustingLeft => dispatch(actions.setIsLateralThrustingLeft(isLateralThrustingLeft)),
    onSetIsLateralThrustingRight: isLateralThrustingRight => dispatch(actions.setIsLateralThrustingRight(isLateralThrustingRight)),
    onSetIsFiringWeapon: isFiringWeapon => dispatch(actions.setIsFiringWeapon(isFiringWeapon)),
    onAddMessage: (message, type) => dispatch(actions.addMessage(message, type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer)
