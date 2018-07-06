import * as actionTypes from './actionTypes'

export const updateHull = value => {
  return {
    type: actionTypes.UPDATE_HULL,
    hull: value
  }
}

export const updateShields = value => {
  return {
    type: actionTypes.UPDATE_SHIELDS,
    shields: value
  }
}
