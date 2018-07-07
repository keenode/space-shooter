import React from 'react'

import styles from './HullDash.css'

const hullDash = props => (
  <div className={styles.HullDash}>
    <div className={styles.HullStatus}>
      <div className={styles.FuelGuage}>
        Fuel: {Math.round(props.fuel)} / {props.fuelMax}
      </div>
      <div className={styles.HullGraphicContainer}>
        <div className={styles.HullGraphic}></div>
        <span className={styles.Indicator_Thrust}>
          <span></span>
          <span></span>
        </span>
        <span className={styles.Indicator_LateralThrust_Left}></span>
        <span className={styles.Indicator_LateralThrust_Right}></span>
        <span className={styles.Indicator_Brakes}></span>
        <span className={styles.Indicator_Weapons}>
          <span></span>
          <span></span>
        </span>
      </div>
    </div>
    <div className={styles.DashCenter}>
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
        <div className={styles.VitalsRow}>
          <div className={[styles.VitalsBar, styles.VitalsBar_Energy].join(' ')}>
            <span
              className={styles.VitalsBar_Fill}
              style={{ width: (props.energy / props.energyMax) * 100 + '%' }}
            ></span>
          </div>
          <span className={[styles.VitalsLabel, styles.VitalsLabel_Energy].join(' ')}>
            {Math.round(props.energy)}
          </span>
        </div>
      </div>
      <ul className={styles.ExpansionBays}>
        <li className={[styles.ExpansionBay, styles.ExpansionBay_Active].join(' ')}>0</li>
        <li className={styles.ExpansionBay}>1</li>
        <li className={styles.ExpansionBay}>2</li>
        <li className={styles.ExpansionBay}>3</li>
      </ul>
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
