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
