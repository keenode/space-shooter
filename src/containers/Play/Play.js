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
          hullDamaged={ value => this.hullDamagedHandler(value) } />
        <HullDash
          hull={this.props.hull}
          hullMax={this.props.hullMax}
          shields={this.props.shields}
          shieldsMax={this.props.shieldsMax} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    hull: state.hull.hull,
    hullMax: state.hull.hullMax,
    shields: state.hull.shields,
    shieldsMax: state.hull.shieldsMax
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHull: value => dispatch(actions.updateHull(value)),
    onUpdateShields: value => dispatch(actions.updateShields(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Play)
