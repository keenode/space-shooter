import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'

import * as actions from '../../store/actions'

import styles from './Play.css'

class Play extends Component {
  hullDamagedHandler(dmgAmt) {
    if (this.props.shields > 0) {
      const dmgDiff = this.props.shields - dmgAmt
      this.props.onUpdateShields(-dmgAmt)
      // console.log('dmgDiff: ' + dmgDiff)
      if (dmgDiff >= 0) {
        console.log('shields damaged: ' + dmgAmt)
      } else {
        const shieldsDamageAmt = dmgDiff + dmgAmt
        console.log('shields damaged: ' + shieldsDamageAmt)
        console.log('hull damaged: ' + Math.abs(dmgDiff))
        this.props.onUpdateHull(dmgDiff)
      }
    } else {
      this.props.onUpdateHull(-dmgAmt)
      console.log('hull damaged: ' + dmgAmt)
    }
  }

  shieldsRegeneratedHandler(regenAmt) {
    this.props.onUpdateShields(regenAmt)
  }

  energyUsedHandler(energyUsed) {
    this.props.onUpdateEnergy(-energyUsed)
  }

  fuelUsedHandler(value) {
    const updatedFuelValue = this.props.fuel - value
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
      <div className={styles.PlayContainer}>
        <GameCanvas
          hull={this.props.hull}
          shields={this.props.shields}
          shieldsRegenRate={this.props.shieldsRegenRate}
          hullDamaged={ dmgAmt => this.hullDamagedHandler(dmgAmt) }
          shieldsRegenerated={ regenAmt => this.shieldsRegeneratedHandler(regenAmt) }
          energyUsed={ energyUsed => this.energyUsedHandler(energyUsed) }
          speedUpdated={ value => this.props.onUpdateSpeed(value) }
          rotationUpdated={ value => this.props.onUpdateRotation(value) }
          fuelUsed={ value => this.fuelUsedHandler(value) }
          pilotModeChanged={ mode => this.props.onSetPilotMode(mode) }
          pilotStateChanged={ (pilotState, value) => this.pilotStateChangedHandler(pilotState, value) } />
        <HullDash
          hull={this.props.hull}
          hullMax={this.props.hullMax}
          shields={this.props.shields}
          shieldsMax={this.props.shieldsMax}
          energy={this.props.energy}
          energyMax={this.props.energyMax}
          speed={this.props.speed}
          speedMax={this.props.speedMax}
          rotation={this.props.rotation}
          fuel={this.props.fuel}
          fuelMax={this.props.fuelMax}
          pilotMode={this.props.pilotMode}
          isThrusting={this.props.isThrusting}
          isBraking={this.props.isBraking}
          isLateralThrustingLeft={this.props.isLateralThrustingLeft}
          isLateralThrustingRight={this.props.isLateralThrustingRight}
          isFiringWeapon={this.props.isFiringWeapon} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    hull: state.hull.hull,
    hullMax: state.hull.hullMax,
    shields: state.hull.shields,
    shieldsMax: state.hull.shieldsMax,
    shieldsRegenRate: state.hull.shieldsRegenRate,
    energy: state.hull.energy,
    energyMax: state.hull.energyMax,
    speed: state.hull.speed,
    speedMax: state.hull.speedMax,
    rotation: state.hull.rotation,
    fuel: state.hull.fuel,
    fuelMax: state.hull.fuelMax,
    pilotMode: state.hull.pilotMode,
    isThrusting: state.hull.isThrusting,
    isBraking: state.hull.isBraking,
    isLateralThrustingLeft: state.hull.isLateralThrustingLeft,
    isLateralThrustingRight: state.hull.isLateralThrustingRight,
    isFiringWeapon: state.hull.isFiringWeapon
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
    onSetIsFiringWeapon: isFiringWeapon => dispatch(actions.setIsFiringWeapon(isFiringWeapon))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Play)
