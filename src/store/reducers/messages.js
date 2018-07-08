import * as actionTypes from '../actions/actionTypes'

const initialState = {
  messages: [
    {
      type: 'log',
      contents: 'Welcome to outer space!',
      sent: new Date()
    }
  ]
}

const addMessage = (state, action) => {
  const newMessage = {
    contents: action.messageContents,
    type: action.messageType,
    sent: new Date()
  }
  const updatedMessages = [...state.messages, newMessage]
  return {
    ...state,
    messages: updatedMessages
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE: return addMessage(state, action)
    default:
      return state
  }
}

export default reducer
