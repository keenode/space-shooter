import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'
import LogsPanel from '../../components/UI/LogsPanel/LogsPanel'

import * as actions from '../../store/actions'

import styles from './GameContainer.css'

class GameContainer extends Component {
  render() {
    return (
      <div className={styles.GameContainer}>
        <GameCanvas
          playerShip={this.props.playerShip}
          gameloopPlayerShipUpdated={ data => this.props.onGameloopPlayerShipUpdate(data) }
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
    onAddNotification: (notification, type) => dispatch(actions.addNotification(notification, type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer)
