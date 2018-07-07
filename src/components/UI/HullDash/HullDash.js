import React from 'react'

import styles from './HullDash.css'

const hullDash = props => (
  <div className={styles.HullDash}>
    <div>
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
    <div className={styles.HullVitals}>
      <div className={styles.VitalsRow}>
        <div className={[styles.VitalsBar, styles.VitalsBar_Shields].join(' ')}>
          <span
            className={styles.VitalsBar_Fill}
            style={{ width: (props.shields / props.shieldsMax) * 100 + '%' }}
          ></span>
        </div>
        <span className={styles.VitalsLabel}>
          {props.shields}
        </span>
      </div>
      <div className={styles.VitalsRow}>
        <div className={[styles.VitalsBar, styles.VitalsBar_Hull].join(' ')}>
          <span
            className={styles.VitalsBar_Fill}
            style={{ width: (props.hull / props.hullMax) * 100 + '%' }}
          ></span>
        </div>
        <span className={styles.VitalsLabel}>
          {props.hull}
        </span>
      </div>
    </div>
    <div className={styles.Speedometer}>
      <span className={styles.SpeedDisplay}>
        {Math.round(props.speed)}ps
      </span>
    </div>
  </div>
)

export default hullDash
