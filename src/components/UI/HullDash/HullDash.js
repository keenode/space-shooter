import React from 'react'

import styles from './HullDash.css'

const hullDash = props => (
  <div className={styles.HullDash}>
    <h2>Hull Dash</h2>
    <span>Speed: 0</span>
    <span>Max Speed: 200</span>
    <span>Rotation: 0deg</span>
    <span>Shields: 100 / 100</span>
    <span>Hull: {props.hull} / {props.maxHull}</span>
    <span>Energy: 100 / 100</span>
    <span>Fuel: 100 / 100</span>
    <span>Mass: 30</span>
    <span>Mode: Drive</span>
  </div>
)

export default hullDash
