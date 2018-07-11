import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'
import LogsPanel from '../../components/UI/LogsPanel/LogsPanel'

import * as actions from '../../store/actions'

import styles from './GameContainer.css'

class GameContainer extends Component {
  // hullDamagedHandler(dmgAmt) {
  //   if (this.props.playerShip.hull <= 0) {
  //     return false
  //   }
  //   if (this.props.playerShip.shields > 0) {
  //     const dmgDiff = this.props.playerShip.shields - dmgAmt
  //     this.props.onUpdateShields(-dmgAmt)
  //     if (dmgDiff >= 0) {
  //       this.props.onAddNotification(`Shields absorbed ${dmgAmt} damage!`, 'shieldsDamaged')
  //     } else {
  //       const shieldsDamageAmt = dmgDiff + dmgAmt
  //       this.props.onAddNotification(`Shields absorbed ${shieldsDamageAmt} damage!`, 'shieldsDamaged')
  //       this.props.onAddNotification(`Hull took ${Math.abs(dmgDiff)} damage!`, 'hullDamaged')
  //       this.props.onUpdateHull(dmgDiff)
  //     }
  //   } else {
  //     this.props.onUpdateHull(-dmgAmt)
  //     this.props.onAddNotification(`Hull took ${dmgAmt} damage!`, 'hullDamaged')
  //   }
  // }

  render() {
    return (
      <div className={styles.GameContainer}>
        <GameCanvas
          playerShip={this.props.playerShip}
          gameloopPlayerShipUpdated={ data => this.props.onGameloopPlayerShipUpdate(data) }
          // hullDamaged={ dmgAmt => this.hullDamagedHandler(dmgAmt) }
          notificationReported={ (message, type) => this.props.onAddNotification(message, type) } />
        <LogsPanel logs={this.props.logs} />
        <HullDash playerShip={this.props.playerShip} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    playerShip: state.playerShip,
    logs: state.logs.notifications
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onGameloopPlayerShipUpdate: data => dispatch(actions.gameloopPlayerShipUpdate(data)),
    onUpdateHull: value => dispatch(actions.updateHull(value)),
    onUpdateShields: value => dispatch(actions.updateShields(value)),
    onAddNotification: (notification, type) => dispatch(actions.addNotification(notification, type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer)
