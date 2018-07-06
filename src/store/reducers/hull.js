import * as actionTypes from '../actions/actionTypes'

const initialState = {
  hull: 100,
  maxHull: 100
}

const updateHull = (state, action) => {
  return {
    ...state,
    hull: action.hull
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_HULL: return updateHull(state, action)
    default:
      return state
  }
}

export default reducer
