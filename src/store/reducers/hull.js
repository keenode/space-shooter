import * as actionTypes from '../actions/actionTypes'

const initialState = {
  hull: 100,
  hullMax: 100,
  shields: 100,
  shieldsMax: 100
}

const updateHull = (state, action) => {
  const hull = action.updatedHull > 0 ? action.updatedHull : 0
  return {
    ...state,
    hull
  }
}

const updateShields = (state, action) => {
  const shields = action.updatedShields > 0 ? action.updatedShields : 0
  return {
    ...state,
    shields
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
