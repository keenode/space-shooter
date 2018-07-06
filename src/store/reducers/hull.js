import * as actionTypes from '../actions/actionTypes'

const initialState = {
  hull: 100,
  hullMax: 100,
  shields: 100,
  shieldsMax: 100,
  energy: 0,
  energyMax: 100,
  speed: 0.0,
  speedMax: 200,
  rotation: 0.0,
  fuel: 100.0,
  fuelMax: 100.0,
  mass: 30.0,
  mode: 'D'
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

const updateEnergy = (state, action) => {
  const energy = action.updatedEnergy > 0 ? action.updatedEnergy : 0
  return {
    ...state,
    energy
  }
}

const updateSpeed = (state, action) => {
  const speed = action.updatedSpeed > 0 ? action.updatedSpeed : 0
  return {
    ...state,
    speed
  }
}

const updateRotation = (state, action) => {
  const rotation = action.updatedRotation > 0 ? action.updatedRotation : 0
  return {
    ...state,
    rotation
  }
}

const updateFuel = (state, action) => {
  const fuel = action.updatedFuel > 0 ? action.updatedFuel : 0
  return {
    ...state,
    fuel
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_HULL: return updateHull(state, action)
    case actionTypes.UPDATE_SHIELDS: return updateShields(state, action)
    case actionTypes.UPDATE_ENERGY: return updateEnergy(state, action)
    case actionTypes.UPDATE_SPEED: return updateSpeed(state, action)
    case actionTypes.UPDATE_ROTATION: return updateRotation(state, action)
    case actionTypes.UPDATE_FUEL: return updateFuel(state, action)
    default:
      return state
  }
}

export default reducer
