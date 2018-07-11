import * as actionTypes from './actionTypes'

export const gameloopPlayerShipUpdate = updatedData => {
  return {
    type: actionTypes.GAMELOOP_PLAYER_SHIP_UPDATE,
    updatedData
  }
}

export const updateHull = changeAmt => {
  return {
    type: actionTypes.UPDATE_HULL,
    changeAmt
  }
}

export const updateShields = changeAmt => {
  return {
    type: actionTypes.UPDATE_SHIELDS,
    changeAmt
  }
}

export const updateEnergy = changeAmt => {
  return {
    type: actionTypes.UPDATE_ENERGY,
    changeAmt
  }
}

export const updateSpeed = value => {
  return {
    type: actionTypes.UPDATE_SPEED,
    updatedSpeed: value
  }
}

export const updateRotation = value => {
  return {
    type: actionTypes.UPDATE_ROTATION,
    updatedRotation: value
  }
}

export const updateFuel = value => {
  return {
    type: actionTypes.UPDATE_FUEL,
    updatedFuel: value
  }
}

export const setPilotMode = mode => {
  return {
    type: actionTypes.SET_PILOT_MODE,
    newPilotMode: mode
  }
}

export const setIsThrusting = isThrusting => {
  return {
    type: actionTypes.SET_IS_THRUSTING,
    isThrusting
  }
}

export const setIsBraking = isBraking => {
  return {
    type: actionTypes.SET_IS_BRAKING,
    isBraking
  }
}

export const setIsLateralThrustingLeft = isLateralThrustingLeft => {
  return {
    type: actionTypes.SET_IS_LATERAL_THRUSTING_LEFT,
    isLateralThrustingLeft
  }
}

export const setIsLateralThrustingRight = isLateralThrustingRight => {
  return {
    type: actionTypes.SET_IS_LATERAL_THRUSTING_RIGHT,
    isLateralThrustingRight
  }
}

export const setIsFiringWeapon = isFiringWeapon => {
  return {
    type: actionTypes.SET_IS_FIRING_WEAPON,
    isFiringWeapon
  }
}
