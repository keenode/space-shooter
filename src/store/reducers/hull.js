import * as actionTypes from '../actions/actionTypes'

const initialState = {
  hull: 100,
  maxHull: 100
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_HULL:
      return {
        hull: action.hull
      }
    default:
      return state
  }
}

export default reducer
