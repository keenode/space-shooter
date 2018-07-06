import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'

import * as actions from '../../store/actions'

import styles from './Play.css'

class Play extends Component {
  hullDamagedHandler(value) {
    if (this.props.shields > 0) {
      const updatedShieldsValue = this.props.shields - value
      this.props.onUpdateShields(updatedShieldsValue)
      if (updatedShieldsValue >= 0) {
        console.log('shields damaged: ' + value)
      } else {
        const updatedHullValue = Math.abs(updatedShieldsValue)
        const shieldsDamageAmt = value - updatedHullValue
        console.log('shields damaged: ' + shieldsDamageAmt)
        console.log('hull damaged: ' + updatedHullValue)
        this.props.onUpdateHull(this.props.hull - updatedHullValue)
      }
    } else {
      this.props.onUpdateHull(this.props.hull - value)
      console.log('hull damaged: ' + value)
    }
  }

  render() {
    return (
      <div className={styles.PlayContainer}>
        <GameCanvas
          hull={this.props.hull}
          hullDamaged={ value => this.hullDamagedHandler(value) }
          speedUpdated={ value => this.props.onUpdateSpeed(value) }
          rotationUpdated={ value => this.props.onUpdateRotation(value) } />
        <HullDash
          hull={this.props.hull}
          hullMax={this.props.hullMax}
          shields={this.props.shields}
          shieldsMax={this.props.shieldsMax}
          speed={this.props.speed}
          speedMax={this.props.speedMax}
          rotation={this.props.rotation} />
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
    speed: state.hull.speed,
    speedMax: state.hull.speedMax,
    rotation: state.hull.rotation
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHull: value => dispatch(actions.updateHull(value)),
    onUpdateShields: value => dispatch(actions.updateShields(value)),
    onUpdateSpeed: value => dispatch(actions.updateSpeed(value)),
    onUpdateRotation: value => dispatch(actions.updateRotation(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Play)
