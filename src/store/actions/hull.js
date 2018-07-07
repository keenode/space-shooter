import * as actionTypes from './actionTypes'

export const updateHull = value => {
  return {
    type: actionTypes.UPDATE_HULL,
    updatedHull: value
  }
}

export const updateShields = value => {
  return {
    type: actionTypes.UPDATE_SHIELDS,
    updatedShields: value
  }
}

export const updateEnergy = value => {
  return {
    type: actionTypes.UPDATE_ENERGY,
    updatedEnergy: value
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
