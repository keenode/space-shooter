import * as actionTypes from '../actions/actionTypes'

const initialState = {
  notifications: [
    {
      type: 'log',
      contents: 'Welcome to outer space!',
      sent: new Date()
    }
  ]
}

const addNotification = (state, action) => {
  const newNotification = {
    contents: action.notificationContents,
    type: action.notificationType,
    sent: new Date()
  }
  const updatedNotifications = [...state.notifications, newNotification]
  return {
    ...state,
    notifications: updatedNotifications
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION: return addNotification(state, action)
    default:
      return state
  }
}

export default reducer
