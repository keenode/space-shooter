import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'

import * as actions from '../../store/actions'

import styles from './Play.css'

class Play extends Component {
  render() {
    return (
      <div className={styles.PlayContainer}>
        <GameCanvas />
        <HullDash hull={this.props.hull} maxHull={this.props.maxHull} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    hull: state.hull.hull,
    maxHull: state.hull.maxHull
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHull: hullPts => dispatch(actions.updateHull(hullPts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Play)
