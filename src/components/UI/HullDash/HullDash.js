import React from 'react'

import styles from './HullDash.css'

const hullDash = props => (
  <div className={styles.HullDash}>
    <div>
      <span>Energy: 100 / 100</span>
      <span>Fuel: 100 / 100</span>
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
      <span className={styles.ModeDisplay}>
        D
      </span>
    </div>
    <div className={styles.RotationGuage}>
      <span className={styles.RotationDisplay}>
        {Math.round(props.rotation)}&deg;
      </span>
    </div>
  </div>
)

export default hullDash
