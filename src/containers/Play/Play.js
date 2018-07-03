import React from 'react'

import GameCanvas from '../../components/GameCanvas/GameCanvas'

import styles from './Play.css'

const play = () => (
  <div className={styles.PlayContainer}>
    <GameCanvas />
  </div>
)

export default play
