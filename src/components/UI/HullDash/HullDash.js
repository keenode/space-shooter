import React from 'react'

import styles from './HullDash.css'

const hullDash = props => (
  <div className={styles.HullDash}>
    <h2>Hull Dash</h2>
    <span>Speed: {props.speed}</span>
    <span>Max Speed: {props.speedMax}</span>
    <span>Rotation: {props.rotation}deg</span>
    <span>Shields: {props.shields} / {props.shieldsMax}</span>
    <span>Hull: {props.hull} / {props.hullMax}</span>
    <span>Energy: 100 / 100</span>
    <span>Fuel: 100 / 100</span>
    <span>Mass: 30</span>
    <span>Mode: Drive</span>
  </div>
)

export default hullDash
