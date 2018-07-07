import * as actionTypes from '../actions/actionTypes'
import { checkBounds } from '../../shared/utility'

const initialState = {
  hull: 100,
  hullMax: 100,
  shields: 100,
  shieldsMax: 100,
  shieldsRegenRate: 0.000000001,
  energy: 100.0,
  energyMax: 100.0,
  speed: 0.0,
  speedMax: 200,
  rotation: 0.0,
  fuel: 100.0,
  fuelMax: 100.0,
  mass: 30.0,
  pilotMode: 'D',
  isThrusting: false,
  isBraking: false,
  isLateralThrustingLeft: false,
  isLateralThrustingRight: false,
  isFiringWeapon: false
}

const updateHull = (state, action) => {
  const hull = checkBounds(state.hull, state.hullMax, action.changeAmt)
  return {
    ...state,
    hull
  }
}

const updateShields = (state, action) => {
  const shields = checkBounds(state.shields, state.shieldsMax, action.changeAmt)
  return {
    ...state,
    shields
  }
}

const updateEnergy = (state, action) => {
  const energy = checkBounds(state.energy, state.energyMax, action.changeAmt)
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
  const numRotations = Math.floor(action.updatedRotation / 360)
  const rotation = action.updatedRotation - 360 * numRotations
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

const setPilotMode = (state, action) => {
  return {
    ...state,
    pilotMode: action.newPilotMode
  }
}

const setIsThrusting = (state, action) => {
  return {
    ...state,
    isThrusting: action.isThrusting
  }
}

const setIsBraking = (state, action) => {
  return {
    ...state,
    isBraking: action.isBraking
  }
}

const setIsLateralThrustingLeft = (state, action) => {
  return {
    ...state,
    isLateralThrustingLeft: action.isLateralThrustingLeft
  }
}

const setIsLateralThrustingRight = (state, action) => {
  return {
    ...state,
    isLateralThrustingRight: action.isLateralThrustingRight
  }
}

const setIsFiringWeapon = (state, action) => {
  return {
    ...state,
    isFiringWeapon: action.isFiringWeapon
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
    case actionTypes.SET_PILOT_MODE: return setPilotMode(state, action)
    case actionTypes.SET_IS_THRUSTING: return setIsThrusting(state, action)
    case actionTypes.SET_IS_BRAKING: return setIsBraking(state, action)
    case actionTypes.SET_IS_LATERAL_THRUSTING_LEFT: return setIsLateralThrustingLeft(state, action)
    case actionTypes.SET_IS_LATERAL_THRUSTING_RIGHT: return setIsLateralThrustingRight(state, action)
    case actionTypes.SET_IS_FIRING_WEAPON: return setIsFiringWeapon(state, action)
    default:
      return state
  }
}

export default reducer
