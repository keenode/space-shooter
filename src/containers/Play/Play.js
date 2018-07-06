import React from 'react'

import GameCanvas from '../../components/GameCanvas/GameCanvas'
import HullDash from '../../components/UI/HullDash/HullDash'

import styles from './Play.css'

const play = () => (
  <div className={styles.PlayContainer}>
    <GameCanvas />
    <HullDash />
  </div>
)

export default play
