import * as actionTypes from './actionTypes'

export const addMessage = (messageContents, messageType = 'log') => {
  return {
    type: actionTypes.ADD_MESSAGE,
    messageType,
    messageContents
  }
}
