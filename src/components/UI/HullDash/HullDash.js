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
        <span
          className={styles.Indicator_Thrust}
          style={{
            display: props.isThrusting ? 'flex' : 'none',
            opacity: props.fuel <= 0 ? 0.2 : 0.8
          }}>
          <span></span>
          <span></span>
        </span>
        <span
          className={styles.Indicator_LateralThrust_Left}
          style={{
            display: props.isLateralThrustingLeft ? 'block' : 'none',
            opacity: props.fuel <= 0 ? 0.2 : 0.8
          }}></span>
        <span
          className={styles.Indicator_LateralThrust_Right}
          style={{
            display: props.isLateralThrustingRight ? 'block' : 'none',
            opacity: props.fuel <= 0 ? 0.2 : 0.8
          }}></span>
        <span
          className={styles.Indicator_Brakes}
          style={{
            display: props.isBraking ? 'block' : 'none',
            backgroundColor: props.pilotMode === 'R' ? 'white' : 'red'
          }}></span>
        <span className={styles.Indicator_Weapons} style={{ display: props.isFiringWeapon ? 'flex' : 'none' }}>
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
        {props.pilotMode}
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
