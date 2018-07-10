import * as actionTypes from './actionTypes'

export const addNotification = (notificationContents, notificationType = 'log') => {
  return {
    type: actionTypes.ADD_NOTIFICATION,
    notificationType,
    notificationContents
  }
}
