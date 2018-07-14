import React from 'react'

import styles from './HullDash.css'

const speedometerAngleOffset = -180
const speedometerSegments = 10
const speedometerStartAngle = 30
const speedometerEndAngle = 270

const fuelMeterAngleOffset = -180
const fuelMeterSegments = 4
const fuelMeterStartAngle = 45
const fuelMeterEndAngle = 135

const hullDash = props => {
  const speedometerTicks = []
  const degSpacing = (speedometerEndAngle - speedometerStartAngle) / (speedometerSegments - 1)
  for (let t = 0; t < speedometerSegments; t++) {
    const tickRotation = t * degSpacing + speedometerStartAngle - speedometerAngleOffset
    const tickLabel = Math.round(props.playerShip.speedMax / (speedometerSegments - 1) * t)
    speedometerTicks.push(
      <span
        key={t}
        className={styles.SpeedometerTickContainer}
        style={{ transform: `rotate(${tickRotation}deg)` }}
      >
        <span className={styles.SpeedometerTick}></span>
        <span
          className={styles.TickLabel}
          style={{ transform: `rotate(${-tickRotation}deg)` }}>
          {tickLabel}
        </span>
      </span>
    )
  }

  const fuelMeterTicks = []
  const fuelDegSpacing = (fuelMeterEndAngle - fuelMeterStartAngle) / (fuelMeterSegments - 1)
  for (let t = 0; t < fuelMeterSegments; t++) {
    const tickRotation = t * fuelDegSpacing + fuelMeterStartAngle - fuelMeterAngleOffset
    const tickLabel = t === 0 ? 'E' : t === fuelMeterSegments - 1 ? 'F' : null
    fuelMeterTicks.push(
      <span
        key={t}
        className={styles.FuelMeterTickContainer}
        style={{ transform: `rotate(${tickRotation}deg)` }}
      >
        <span className={styles.FuelMeterTick}></span>
        <span
          className={styles.TickLabel}
          style={{
            left: tickLabel === 'E' ? -25 : 0,
            transform: `rotate(${-tickRotation}deg)`
          }}>
          {tickLabel}
        </span>
      </span>
    )
  }

  const radToDegRotation = props.playerShip.rotation * 180 / Math.PI
  const totalRotations = Math.floor(radToDegRotation / 360)
  const facingAngle = radToDegRotation - 360 * totalRotations

  return (
    <div className={styles.HullDash}>
      <div className={styles.HullStatus}>
        {fuelMeterTicks}
        <div className={styles.FuelFractionDisplay}>
          <span className={styles.FuelAmount}>{Math.round(props.playerShip.fuel)}</span>
          <span className={styles.FuelMaxAmount}>{props.playerShip.fuelMax}</span>
        </div>
        <span
          className={styles.FuelMeter_LineContainer}
          style={{ transform: `rotate(${(fuelMeterEndAngle - fuelMeterStartAngle) * props.playerShip.fuel / props.playerShip.fuelMax + fuelMeterStartAngle - fuelMeterAngleOffset}deg)` }}
        >
          <span className={styles.FuelMeter_Line}></span>
        </span>
        <div className={styles.HullGraphicContainer}>
          <div className={styles.HullGraphic}></div>
          <span
            className={styles.Indicator_Thrust}
            style={{
              display: props.playerShip.isThrusting ? 'flex' : 'none',
              opacity: props.playerShip.fuel <= 0 ? 0.2 : 0.8
            }}>
            <span></span>
            <span></span>
          </span>
          <span
            className={styles.Indicator_LateralThrust_Left}
            style={{
              display: props.playerShip.isLateralThrustingLeft ? 'block' : 'none',
              opacity: props.playerShip.fuel <= 0 ? 0.2 : 0.8
            }}></span>
          <span
            className={styles.Indicator_LateralThrust_Right}
            style={{
              display: props.playerShip.isLateralThrustingRight ? 'block' : 'none',
              opacity: props.playerShip.fuel <= 0 ? 0.2 : 0.8
            }}></span>
          <span
            className={styles.Indicator_Brakes}
            style={{
              display: props.playerShip.isBraking ? 'block' : 'none',
              backgroundColor: props.playerShip.pilotMode === 'R' ? 'white' : 'red'
            }}></span>
          <span className={styles.Indicator_Weapons} style={{ display: props.playerShip.isFiringWeapon ? 'flex' : 'none' }}>
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
                style={{ transform: `scaleX(${props.playerShip.shields / props.playerShip.shieldsMax})` }}
              ></span>
            </div>
            <span className={styles.VitalsLabel}>
              {props.playerShip.shields}
            </span>
          </div>
          <div className={styles.VitalsRow}>
            <div className={[styles.VitalsBar, styles.VitalsBar_Hull].join(' ')}>
              <span
                className={styles.VitalsBar_Fill}
                style={{ transform: `scaleX(${props.playerShip.hull / props.playerShip.hullMax})` }}
              ></span>
            </div>
            <span className={styles.VitalsLabel}>
              {props.playerShip.hull}
            </span>
          </div>
          <div className={[styles.VitalsRow, styles.VitalsRow_Energy].join(' ')}>
            <div className={[styles.VitalsBar, styles.VitalsBar_Energy].join(' ')}>
              <span
                className={styles.VitalsBar_Fill}
                style={{ transform: `scaleX(${props.playerShip.energy / props.playerShip.energyMax})` }}
              ></span>
            </div>
            <span className={[styles.VitalsLabel, styles.VitalsLabel_Energy].join(' ')}>
              {Math.round(props.playerShip.energy)}
            </span>
          </div>
        </div>
        <ul className={styles.ExpansionBays}>
          <li className={styles.ExpansionBay}><span>1</span></li>
          <li className={styles.ExpansionBay}><span>2</span></li>
          <li className={styles.ExpansionBay}><span>3</span></li>
          <li className={styles.ExpansionBay}><span>4</span></li>
        </ul>
      </div>
      <div className={styles.Speedometer}>
        {speedometerTicks}
        <span
          className={styles.Speedometer_LineContainer}
          style={{ transform: `rotate(${(speedometerEndAngle - speedometerStartAngle) * props.playerShip.speed / props.playerShip.speedMax + speedometerStartAngle - speedometerAngleOffset}deg)` }}
        >
          <span className={styles.Speedometer_Line}></span>
        </span>
        <span className={styles.SpeedDisplay}>
          {Math.round(props.playerShip.speed)}<span>ps</span>
        </span>
        <span
          className={styles.ModeDisplay}
          style={{ color: props.playerShip.pilotMode === 'D' ? 'orange' : 'yellow' }}
        >
          {props.playerShip.pilotMode}
        </span>
      </div>
      <div className={styles.RotationGuage}>
        <span className={styles.RotationGuage_Stick} style={{ transform: `rotate(${facingAngle}deg)` }}></span>
        <span className={styles.RotationDisplay}>
          {Math.round(facingAngle)}&deg;
        </span>
      </div>
    </div>
  )
}

export default hullDash
