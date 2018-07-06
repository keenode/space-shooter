import * as actionTypes from '../actions/actionTypes'

const initialState = {
  hull: 100,
  hullMax: 100,
  shields: 100,
  shieldsMax: 100
}

const updateHull = (state, action) => {
  return {
    ...state,
    hull: action.hull
  }
}

const updateShields = (state, action) => {
  return {
    ...state,
    shields: action.shields
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_HULL: return updateHull(state, action)
    case actionTypes.UPDATE_SHIELDS: return updateShields(state, action)
    default:
      return state
  }
}

export default reducer
