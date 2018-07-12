import * as actionTypes from '../actions/actionTypes'
import { checkBounds } from '../../shared/utility'

const initialState = {
  // Vitals
  shields: 100,
  shieldsMax: 100,
  hull: 100,
  hullMax: 100,
  energy: 100.0,
  energyMax: 100.0,
  fuel: 100.0,
  fuelMax: 100.0,

  // Position, Velocity & Forces
  position: {
    x: 0,
    y: 0
  },
  rotation: 0.0,
  speed: 0.0,
  velocity: {
    x: 0,
    y: 0
  },
  rotationalVelocity: 0,
  lateralThrustForce: {
    x: 0,
    y: 0
  },
  reverseThrustForce: {
    x: 0,
    y: 0
  },

  // Piloting states
  isAlive: true,
  isThrusting: false,
  isLateralThrustingLeft: false,
  isLateralThrustingRight: false,
  isBraking: false,
  isRequestingToFireWeapon: false,
  isFiringWeapon: false,
  pilotMode: 'D',

  // Specs
  mass: 0.98,
  speedMax: 20.0,
  lateralThrustSpdMax: 5.0,
  thrustPower: 0.41,
  lateralThrustPower: 0.5,
  brakeForce: 0.9, 
  reverseThrustPower: 0.25,
  rotAccel: 0.05,
  rotSpdMax: 0.05,
  shieldsRegenRate: 10.0,
  energyRegenRate: 5.0,
  weaponFireRate: 10.0,
  weaponEnergyUsage: 5.0
}

const gameloopPlayerShipUpdate = (state, action) => {
  return {
    ...state,
    ...action.updatedData
  }
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
    case actionTypes.GAMELOOP_PLAYER_SHIP_UPDATE: return gameloopPlayerShipUpdate(state, action)
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
