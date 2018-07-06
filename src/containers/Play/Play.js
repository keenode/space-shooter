import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'

import * as actions from '../../store/actions'

import styles from './Play.css'

class Play extends Component {
  hullDamagedHandler(value) {
    this.props.onUpdateHull(this.props.hull - value)
  }

  render() {
    return (
      <div className={styles.PlayContainer}>
        <GameCanvas
          hull={this.props.hull}
          hullDamaged={ value => this.hullDamagedHandler(value) } />
        <HullDash
          hull={this.props.hull}
          hullMax={this.props.hullMax} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    hull: state.hull.hull,
    hullMax: state.hull.hullMax
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHull: hullPts => dispatch(actions.updateHull(hullPts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Play)
